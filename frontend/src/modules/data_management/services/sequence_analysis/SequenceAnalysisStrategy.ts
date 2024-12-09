import { PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { db } from "@/modules/core/infrastructure/database";
import { v4 as uuidv4 } from "uuid";

import {
    BacterialQualityParameters,
    SampleImport,
    SampleSchema,
    ViralQualityParameters,
} from "@/modules/core/models/samples";
import { gentrainApi, gentrainWebsocket } from "@/modules/core/main";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";

const FAILED_ANALYSES_THRESHOLD = 10;
export abstract class SequenceAnalysisStrategy {
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
        this.pathogen = pathogen;
        this.fastaIdsToAnalyse = {};
        this.finishedFastaIds = [];
        this.failedFastaIds = [];
        this.roomName = "";
    }

    public setRoomName(roomName: string) {
        this.roomName = roomName;
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
        useDataManagementStore.getState().setSequenceAnalysisRunning(true);
        this.joinRoomAndRunAnalysis();
        this.handleAnalysisEvents();
    };

    public handlePersistedResults = async () => {
        const session = useCoreStore.getState().session;
        if (!session) {
            throw new GentrainException("InvalidSession");
        }
        const results = await gentrainApi.getSequenceAnalysisResultsForSessionAndPathogen(session.id, this.pathogen.id);
        if (results.length > 0) {
            await this.syncPersistedResultsWithDb(results);
            useCoreStore.getState().updateCasesWithRelationships();
            this.initDistanceCalculation();
        }
    };

    private joinRoomAndRunAnalysis = async () => {
        if (!this.pathogen.pathogen_type) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        await gentrainWebsocket.joinRoom(this.pathogen.pathogen_type?.name, async (roomName) => {
            this.setRoomName(roomName);
            await this.runAnalysis();
        });
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
            if (!Object.keys(useDataManagementStore.getState().sampleImports).includes(fastaId)) {
                continue;
            }
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ fasta_id: fastaId }).first();
            // we currently only add samples if a case for the fasta id exists already
            // otherwise we would maximize the necessary amount of variant calculations
            if (sampleCase) {
                const uniqueSequenceIdentifier = uuidv4();
                this.fastaIdsToAnalyse[uniqueSequenceIdentifier] = fastaId;
                db.sequence_identifiers.add({
                    id: uniqueSequenceIdentifier,
                    fasta_id: fastaId,
                    pathogen_id: this.pathogen.id,
                });
            }
        }
        this.initNextSequenceAnalyses();
    };

    private handleAnalysisEvents = () => {
        gentrainWebsocket.listenForSequenceAnalysisResponse(
            async (data) => await this.sequenceAnalysisResponseActions(data)
        );
        gentrainWebsocket.listenForSequenceAnalysisEnqueued(
            async (data) => await this.sequenceAnalysisEnqueuedActions(data)
        );
        gentrainWebsocket.listenForSequenceAnalysisFailed(
            async (data) => await this.sequenceAnalysisFailedActions(data)
        );
        gentrainWebsocket.listenForSequenceAnalysisStarted(
            async (data) => await this.sequenceAnalysisStartedActions(data)
        );
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
            gentrainWebsocket.emitSequenceAnalysis(
                this.pathogen.id,
                Object.keys(this.fastaIdsToAnalyse)[i],
                this.sampleData[fastaIdToAnalyse].imported.sequence
            );
        }
    };

    private handleSuccessfulAnalysis = async (fastaId: string, result: any, sequence_length: number) => {
        await this.createSampleAndSequenceAnalysis(fastaId, result, sequence_length);
        useDataManagementStore.getState().changeSampleImport(fastaId, { status: "finished" });
    };

    private handleUnsuccessfulAnalysis = (fastaId: string) => {
        useDataManagementStore.getState().changeSampleImport(fastaId, {
            status: "failed",
        });
        this.failedFastaIds.push(fastaId);
        this.interruptIfFailedAnalysesThresholdExceeded();
    };

    private async sequenceAnalysisResponseActions(data: any) {
        const fastaId = this.fastaIdsToAnalyse[data.sequence_identifier];
        if (data.status === "success") {
            await this.handleSuccessfulAnalysis(fastaId, data.result, data.sequence_length);
        }
        if (data.status === "error") {
            this.handleUnsuccessfulAnalysis(fastaId);
        }
        this.finishedFastaIds.push(fastaId);
        if (this.finishedFastaIds.length % 10 === 0) {
            this.initNextSequenceAnalyses();
        }
        const session = useCoreStore.getState().session;
        if (!session) {
            throw new GentrainException("");
        }
        gentrainApi.deleteSequenceAnalysisResultForPathogenAndSession(
            session?.id,
            this.pathogen.id,
            data.sequence_identifier
        );
        this.continueIfAllAnalysesAreDone();
    }

    private async sequenceAnalysisEnqueuedActions(sequence_identifier: string) {
        useDataManagementStore.getState().changeSampleImport(this.fastaIdsToAnalyse[sequence_identifier], {
            status: "enqueued",
        });
    }

    private async sequenceAnalysisStartedActions(sequence_identifier: string) {
        useDataManagementStore.getState().changeSampleImport(this.fastaIdsToAnalyse[sequence_identifier], {
            status: "started",
        });
    }

    private async sequenceAnalysisFailedActions(sequence_identifier: string) {
        useDataManagementStore.getState().changeSampleImport(this.fastaIdsToAnalyse[sequence_identifier], {
            status: "failed",
        });
        this.finishedFastaIds.push(this.fastaIdsToAnalyse[sequence_identifier]);
        this.continueIfAllAnalysesAreDone();
    }

    private async handleSingleAnalysisResult(data: {
        sequence_identifier: string;
        result: any;
        sequence_length: number;
    }) {
        const fastaId = this.fastaIdsToAnalyse[data.sequence_identifier];
        this.finishedFastaIds.push(fastaId);
        await this.createSampleAndSequenceAnalysis(fastaId, data.result, data.sequence_length);
        useDataManagementStore.getState().changeSampleImport(fastaId, { status: "finished" });
        db.sequence_identifiers.delete(data.sequence_identifier);
    }

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
        useDataManagementStore.getState().setSequenceAnalysisRunning(false);
        useCoreStore.getState().updateCasesWithRelationships();
        this.initDistanceCalculation();
        gentrainWebsocket.stopListenForSequenceAnalysisEnqueued();
        gentrainWebsocket.stopListenForSequenceAnalysisFailed();
        gentrainWebsocket.stopListenForSequenceAnalysisStarted();
        gentrainWebsocket.stopListenForSequenceAnalysisEnqueued();
        if (!this.pathogen.pathogen_type) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        gentrainWebsocket.leaveRoom(this.pathogen.pathogen_type?.name);
    }

    public initDistanceCalculation = async () => {
        const distanceCalculationStrategy = await PathogenStrategyManager.getDistanceCalculationStrategy(this.pathogen);
        if (!distanceCalculationStrategy) return;
        await distanceCalculationStrategy.execute();
    };

    private syncPersistedResultsWithDb = async (
        results: { result: object; sequence_identifier: string; sequence_length: number }[]
    ) => {
        for (const result of results) {
            const sequenceIdentifier = await db.sequence_identifiers.get(result.sequence_identifier);
            if (!sequenceIdentifier) {
                continue;
            }
            if ((await db.samples.where({ fasta_id: sequenceIdentifier.fasta_id }).count()) > 0) continue;
            await this.createSampleAndSequenceAnalysis(
                sequenceIdentifier.fasta_id,
                result.result,
                result.sequence_length
            );
            db.sequence_identifiers.delete(result.sequence_identifier);
        }
    };
}
