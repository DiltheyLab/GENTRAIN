import { PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { socket } from "@/modules/core/helpers/socket";
import { CoreState, useCoreStore } from "@/modules/core/stores/core";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { db } from "@/modules/core/infrastructure/database";
import { toSlug } from "@/modules/core/helpers/strings";
import { BacterialQualityParameters, SampleImport, ViralQualityParameters } from "@/modules/core/models/samples";

export abstract class SequenceAnalysisStrategy {
    protected coreState: CoreState;
    protected dataManagementState: DataManagementState;
    protected pathogen: PathogenWithRelationships;
    protected sampleData: { [fasta_id: string]: SampleImport } = {};
    protected fastaIdsToAnalyse: string[];
    protected finishedFastaIds: string[];
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
        this.fastaIdsToAnalyse = [];
        this.finishedFastaIds = [];
        this.roomName = "";
    }

    public setSampleData = (sampleData: { [fasta_id: string]: SampleImport }) => {
        this.sampleData = sampleData;
    };

    public execute = async () => {
        if (!this.sampleData) {
            console.error("No sample data was provided. Run setSampleData(<sample_data>) first.");
            return;
        }
        this.dataManagementState.setSequenceAnalysisRunning(true);
        this.joinRoomAndRunAnalysis();
        this.handleCompletedAnalyses();
    };

    public handlePersistedResults = async () => {
        if (socket) {
            socket.emit(
                "gentrain_session_results_request",
                this.coreState.session?.id,
                this.pathogen.pathogen_type?.name
            );
            socket.once(`results_${this.coreState.session?.id}`, async (results) => {
                const strategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
                if (strategy) {
                    for (const result of results) {
                        if ((await db.samples.where({ fasta_id: result["fasta_id"] }).count()) > 0) continue;
                        await strategy.createSampleAndSequenceAnalysis(
                            result["fasta_id"],
                            result["result"],
                            result["sequence_length"]
                        );
                    }
                    this.coreState.updateCasesWithRelationships();
                    this.initDistanceCalculation();
                }
            });
        }
    };

    private joinRoomAndRunAnalysis = () => {
        if (socket) {
            socket.emit(`join_${this.pathogen.pathogen_type?.name}`, this.coreState.session?.id);
            socket.once(`${this.pathogen.pathogen_type?.name}_room_created`, async (roomName: string) => {
                this.roomName = roomName;
                console.log(`Room ${this.roomName} was joined.`);
                await this.runAnalysis();
            });
            socket.on("sequence_analysis_enqueued", (fastaId: string) => {
                this.dataManagementState.changeSampleImport(fastaId, { status: "enqueued" });
            });
            socket.on("sequence_analysis_failed", (fastaId: string) => {
                this.dataManagementState.changeSampleImport(fastaId, { status: "failed" });
            });
            socket.on("sequence_analysis_started", (fastaId: string) => {
                this.dataManagementState.changeSampleImport(fastaId, { status: "started" });
            });
        }
    };

    private runAnalysis = async () => {
        if (!this.sampleData) {
            return;
        }
        for (const fastaId of Object.keys(this.sampleData)) {
            const sample = this.sampleData[fastaId];
            if (!sample.upload) {
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
                this.emitSequenceAnalysisMessage({ fastaId: fastaId, sequence: sample.sequence });
                this.fastaIdsToAnalyse.push(fastaId);
            }
        }
    };

    private handleCompletedAnalyses = () => {
        if (socket) {
            socket.on("sequence_analysis_response", async (data: any) => {
                this.handleSingleAnalysisResult(data);
                this.continueIfAllAnalysesAreDone();
            });
        }
    };

    private emitSequenceAnalysisMessage = async ({ fastaId, sequence }: { fastaId: string; sequence: string }) => {
        const sequenceChunks = sequence.match(/(.|[\r\n]){1,500000}/g);
        for (const index in sequenceChunks!) {
            if (socket) {
                socket.emit("sequence_analysis_request", toSlug(this.pathogen.name), fastaId, sequenceChunks[index], {
                    total: sequenceChunks.length,
                    index: index,
                });
            }
        }
    };

    public async handleSingleAnalysisResult(data: { fasta_id: string; result: any; sequence_length: number }) {
        this.finishedFastaIds.push(data.fasta_id);
        await this.createSampleAndSequenceAnalysis(data.fasta_id, data.result, data.sequence_length);
        this.dataManagementState.changeSampleImport(data.fasta_id, { status: "finished" });
        this.removePersistedResultFromRedis(data.fasta_id);
    }

    private removePersistedResultFromRedis = (fastaId: string) => {
        if (socket) {
            socket.emit(
                `gentrain_session_results_remove_request`,
                this.coreState.session?.id,
                this.pathogen.pathogen_type?.name,
                fastaId
            );
        }
    };

    private continueIfAllAnalysesAreDone() {
        if (this.finishedFastaIds.length === this.fastaIdsToAnalyse.length) {
            this.dataManagementState.setSequenceAnalysisRunning(false);
            this.coreState.updateCasesWithRelationships();
            this.initDistanceCalculation();
            if (socket) {
                console.log(`Room ${this.roomName} was left.`);
                socket.emit(`leave_${this.pathogen.pathogen_type?.name}`);
                socket.off("sequence_analysis_response");
            }
        }
    }

    public initDistanceCalculation = async () => {
        const distanceCalculationStrategy = await PathogenStrategyManager.getDistanceCalculationStrategy();
        if (!distanceCalculationStrategy) return;
        await distanceCalculationStrategy.execute();
    };
}
