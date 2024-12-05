import { PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { socket } from "@/modules/core/helpers/socket";
import { CoreState, useCoreStore } from "@/modules/core/stores/core";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { db } from "@/modules/core/infrastructure/database";
import { v4 as uuidv4 } from "uuid";

import {
    BacterialQualityParameters,
    SampleImport,
    SampleSchema,
    ViralQualityParameters,
} from "@/modules/core/models/samples";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";

const FAILED_ANALYSES_THRESHOLD = 10;
export abstract class SequenceAnalysisStrategy {
    protected coreState: CoreState;
    protected dataManagementState: DataManagementState;
    protected pathogen: PathogenWithRelationships;
    protected sampleData: {
        [id: string]: { imported: SampleImport; persisted: SampleSchema | null; import: boolean };
    } = {};
    protected fastaIdsToAnalyse: { [sequenceIdentifier: string]: string };
    protected finishedFastaIds: string[];
    protected failedFastaIds: string[];
    protected roomName: string;

    public abstract createSampleAndSequenceAnalysis(
        fastaId: string,
        sequenceAnalysisResult: object,
        sequenceLength?: number
    ): Promise<void>;

    public abstract getQualityParameters(sequence: string): ViralQualityParameters | BacterialQualityParameters;

    constructor(pathogen: PathogenWithRelationships) {
        this.coreState = useCoreStore.getState();
        this.dataManagementState = useDataManagementStore.getState();
        this.pathogen = pathogen;
        this.fastaIdsToAnalyse = {};
        this.finishedFastaIds = [];
        this.failedFastaIds = [];
        this.roomName = "";
    }

    public setSampleData = (sampleData: {
        [id: string]: { imported: SampleImport; persisted: SampleSchema | null; import: boolean };
    }) => {
        this.sampleData = sampleData;
    };

    public execute = () => {
        if (!this.sampleData) {
            console.error("No sample data was provided. Run setSampleData(<sample_data>) first.");
            return;
        }
        try {
            this.dataManagementState.setSequenceAnalysisRunning(true);
            this.joinRoomAndRunAnalysis();
            this.handleAnalysisEvents();
        } catch (error) {
            throw error;
        }
    };

    public handlePersistedResults = async () => {
        if (socket) {
            socket.emit(
                "gentrain_session_results_request",
                this.coreState.session?.id,
                this.pathogen.pathogen_type?.name
            );
            socket.once(`results_${this.coreState.session?.id}`, async (results) => {
                for (const result of results) {
                    if ((await db.samples.where({ fasta_id: result["sequence_identifier"] }).count()) > 0) continue;
                    await this.createSampleAndSequenceAnalysis(
                        result["fasta_id"],
                        result["result"],
                        result["sequence_length"]
                    );
                }
                this.coreState.updateCasesWithRelationships();
                this.initDistanceCalculation();
            });
        }
    };

    private joinRoomAndRunAnalysis = () => {
        if (socket) {
            socket.emit(`join_${this.pathogen.pathogen_type?.name}`, this.coreState.session?.id);
            socket.once(`${this.pathogen.pathogen_type?.name}_room_created`, async (roomName: string) => {
                this.roomName = roomName;
                console.log(`Room ${this.roomName} was joined.`);
                this.runAnalysis();
            });
        }
    };

    private runAnalysis = async () => {
        if (!this.sampleData) {
            return;
        }

        for (const fastaId of Object.keys(this.sampleData)) {
            const sample = this.sampleData[fastaId];
            if (!sample.import) {
                continue;
            }
            // skip sample if it was excluded from uploads
            if (!Object.keys(this.dataManagementState.sampleImports).includes(fastaId)) {
                continue;
            }
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ fasta_id: fastaId }).first();
            // we currently only add samples if a case for the fasta id exists already
            // otherwise we would maximize the necessary amount of variant calculations
            if (sampleCase) {
                const uniqueSequenceIdentifier = uuidv4();
                this.fastaIdsToAnalyse[uniqueSequenceIdentifier] = fastaId;
            }
        }
        this.initNextSequenceAnalyses();
    };

    private handleAnalysisEvents = () => {
        if (socket) {
            socket.on("sequence_analysis_response", async (data: any) => {
                const fastaId = this.fastaIdsToAnalyse[data.sequence_identifier];
                if (data.status === "success") {
                    await this.handleSuccessfulAnalysis(fastaId, data.result, data.sequence_length);
                }
                if (data.status === "error") {
                    this.handleUnsuccessfulAnalysis(fastaId);
                }
                this.removePersistedResultFromRedis(data.sequence_identifier);
                this.finishedFastaIds.push(fastaId);
                if (this.finishedFastaIds.length % 10 === 0) {
                    this.initNextSequenceAnalyses();
                }
                this.continueIfAllAnalysesAreDone();
            });
            socket.on("sequence_analysis_enqueued", (sequence_identifier: string) => {
                this.dataManagementState.changeSampleImport(this.fastaIdsToAnalyse[sequence_identifier], {
                    status: "enqueued",
                });
            });
            socket.on("sequence_analysis_started", (sequence_identifier: string) => {
                this.dataManagementState.changeSampleImport(this.fastaIdsToAnalyse[sequence_identifier], {
                    status: "started",
                });
            });
        }
    };

    private handleSuccessfulAnalysis = async (fastaId: string, result: any, sequence_length: number) => {
        await this.createSampleAndSequenceAnalysis(fastaId, result, sequence_length);
        this.dataManagementState.changeSampleImport(fastaId, { status: "finished" });
    };

    private handleUnsuccessfulAnalysis = (fastaId: string) => {
        this.dataManagementState.changeSampleImport(fastaId, {
            status: "failed",
        });
        this.failedFastaIds.push(fastaId);
        this.interruptIfFailedAnalysesThresholdExceeded();
    };

    private initNextSequenceAnalyses = async () => {
        // use total amount of sequences to analyse or the amount of finished analyses for socket message limit
        // depending on which value is lower
        const socketMessageLimit = Math.min(
            this.finishedFastaIds.length + 10,
            Object.keys(this.fastaIdsToAnalyse).length
        );
        // always send max. 10 message via websockt channel to regulate user inputs
        for (let i = this.finishedFastaIds.length; i < socketMessageLimit; i++) {
            const fastaIdToAnalyse = this.fastaIdsToAnalyse[Object.keys(this.fastaIdsToAnalyse)[i]];
            await this.emitSequenceAnalysisMessage({
                sequenceIdentifier: Object.keys(this.fastaIdsToAnalyse)[i],
                sequence: this.sampleData[fastaIdToAnalyse].imported.sequence,
            });
        }
    };

    private emitSequenceAnalysisMessage = async ({
        sequenceIdentifier,
        sequence,
    }: {
        sequenceIdentifier: string;
        sequence: string;
    }) => {
        const sequenceChunks = sequence.match(/(.|[\r\n]){1,500000}/g);

        for (const index in sequenceChunks!) {
            if (socket) {
                socket.emit("sequence_analysis_request", this.pathogen.id, sequenceIdentifier, sequenceChunks[index], {
                    total: sequenceChunks.length,
                    index: index,
                });
            }
        }
    };

    private removePersistedResultFromRedis = (sequenceIdentifier: string) => {
        if (socket) {
            socket.emit(
                `gentrain_session_results_remove_request`,
                this.coreState.session?.id,
                this.pathogen.pathogen_type?.name,
                sequenceIdentifier
            );
        }
    };

    private continueIfAllAnalysesAreDone() {
        if (this.finishedFastaIds.length === Object.keys(this.fastaIdsToAnalyse).length) {
            this.continue();
        }
    }

    private interruptIfFailedAnalysesThresholdExceeded() {
        if (this.failedFastaIds.length > FAILED_ANALYSES_THRESHOLD) {
            this.continue();
            throw new GentrainException("FailedAnalysesThresholdExceeded");
        }
    }

    private continue() {
        this.dataManagementState.setSequenceAnalysisRunning(false);
        this.coreState.updateCasesWithRelationships();
        this.initDistanceCalculation();
        if (socket) {
            console.log(`Room ${this.roomName} was left.`);
            socket.emit(`leave_${this.pathogen.pathogen_type?.name}`);
            socket.off("sequence_analysis_response");
            socket.off("sequence_analysis_enqueued");
            socket.off("sequence_analysis_failed");
            socket.off("sequence_analysis_started");
        }
    }

    public initDistanceCalculation = async () => {
        const distanceCalculationStrategy = await PathogenStrategyManager.getDistanceCalculationStrategy(this.pathogen);
        if (!distanceCalculationStrategy) return;
        await distanceCalculationStrategy.execute();
    };
}
