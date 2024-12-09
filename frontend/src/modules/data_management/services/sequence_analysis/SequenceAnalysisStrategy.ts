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

export abstract class SequenceAnalysisStrategy {
    protected pathogen: PathogenWithRelationships;
    protected sampleData: {
        [id: string]: { imported: SampleImport; persisted: SampleSchema | null; import: boolean };
    } = {};
    protected fastaIdsToAnalyse: { [sequenceIdentifier: string]: string };
    protected finishedFastaIds: string[];
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

    public execute = async () => {
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
            throw new GentrainException("");
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
                gentrainWebsocket.emitSequenceAnalysis(
                    this.pathogen.id,
                    uniqueSequenceIdentifier,
                    sample.imported.sequence
                );
                this.fastaIdsToAnalyse[uniqueSequenceIdentifier] = fastaId;
                db.sequence_identifiers.add({ id: uniqueSequenceIdentifier, fasta_id: fastaId });
            }
        }
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

    private async sequenceAnalysisResponseActions(data: any) {
        await this.handleSingleAnalysisResult(data);
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
        const session = useCoreStore.getState().session;
        const fastaId = this.fastaIdsToAnalyse[data.sequence_identifier];
        this.finishedFastaIds.push(fastaId);
        await this.createSampleAndSequenceAnalysis(fastaId, data.result, data.sequence_length);
        useDataManagementStore.getState().changeSampleImport(fastaId, { status: "finished" });
        if (!session) {
            throw new GentrainException("");
        }
        gentrainApi.deleteSequenceAnalysisResultForPathogenAndSession(
            session?.id,
            this.pathogen.id,
            data.sequence_identifier
        );
        db.sequence_identifiers.delete(data.sequence_identifier);
    }

    private continueIfAllAnalysesAreDone() {
        if (this.finishedFastaIds.length === Object.keys(this.fastaIdsToAnalyse).length) {
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
