import { PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import gentrainApiInstance from "@/modules/core/adapters/GentrainApi";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket";
import {
    BacterialQualityParameters,
    SequenceImport,
    ViralQualityParameters,
} from "@/modules/core/models/sequence_analyses";

export abstract class SequenceAnalysisStrategy {
    protected pathogen: PathogenWithRelationships;
    protected sequenceImports: { [sequenceHash: string]: SequenceImport } = {};
    protected roomName: string;
    protected parallelAnalysesThreshold: number | null = null;
    protected sequenceHashCaseMapping: { [hash: string]: number[] } = {};

    public abstract getQualityParameters(sequence: string): ViralQualityParameters | BacterialQualityParameters;
    protected abstract emitSequenceAnalysis(): void;
    protected abstract setSequenceImports(sequenceImports: { [sequenceHash: string]: SequenceImport }): void;

    constructor(pathogen: PathogenWithRelationships) {
        this.pathogen = pathogen;
        this.roomName = "";
    }

    public setRoomName(roomName: string) {
        this.roomName = roomName;
    }

    public execute = async () => {
        useDataManagementStore.getState().setSequenceAnalysisRunning(true);
        await this.joinRoomAndRunAnalysis();
        this.handleAnalysisEvents();
    };

    public handlePersistedResults = async () => {
        const sessionId = useCoreStore.getState().sessionId;
        if (!sessionId) {
            throw new GentrainException("InvalidSession");
        }
        const results = await gentrainApiInstance.getPersistedSequenceAnalyses(sessionId, this.pathogen.id);
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
        await gentrainWebsocketInstance.joinRoom(this.pathogen.pathogen_type?.name, async (roomName) => {
            this.setRoomName(roomName);
            await this.runAnalysis();
        });
    };

    private runAnalysis = async () => {
        for (const sequenceHash in this.sequenceImports) {
            const sequenceImport = this.sequenceImports[sequenceHash];
            const existingSequenceAnalysis = await db.sequence_analyses.where({ sequence_hash: sequenceHash }).first();
            let sequenceAnalysisId = existingSequenceAnalysis?.id;
            if (sequenceAnalysisId) {
                // mark sequence analysis as successful if a result for the provided hash already exists
                if (existingSequenceAnalysis?.result) {
                    this.sequenceImports[sequenceHash].status = "success";
                }
            } else {
                // create a new sequence analysis object if not result is available for the provided sequence hash
                sequenceAnalysisId = await db.sequence_analyses.add({
                    sequence_hash: sequenceHash,
                    pathogen_id: useCoreStore.getState().activePathogen!.id,
                });
            }
            const caseMapping = await db.sequence_analyses_cases
                .where({ sequence_analysis_id: sequenceAnalysisId, fasta_id: sequenceImport.fasta_id })
                .first();
            // create a mapping between existing sequence analysis id and fasta id if it does not already exist
            // a sequence may be associated with mutiple cases via fasta ids
            if (!caseMapping) {
                db.sequence_analyses_cases.add({
                    sequence_analysis_id: sequenceAnalysisId,
                    fasta_id: sequenceImport.fasta_id,
                });
            }
        }
        this.emitSequenceAnalysis();
    };

    private handleAnalysisEvents = () => {
        gentrainWebsocketInstance.listenForEvent("sequence_analysis_response", async (data) =>
            this.sequenceAnalysisResponseActions(data)
        );
        gentrainWebsocketInstance.listenForEvent("sequence_analysis_enqueued", async (data) =>
            this.sequenceAnalysisEnqueuedActions(data)
        );
        gentrainWebsocketInstance.listenForEvent("sequence_analysis_started", async (data) =>
            this.sequenceAnalysisStartedActions(data)
        );
    };

    protected async sequenceAnalysisResponseActions(data: any) {
        const sentSequenceAnalysesCount = Object.keys(this.sequenceImports).map(
            (sequenceHash) => this.sequenceImports[sequenceHash].status === "sent"
        ).length;
        if (data.status === "success") {
            await this.handleSuccessfulAnalysis(data.sequence_hash, data.result);
        }
        if (data.status === "error") {
            this.handleUnsuccessfulAnalysis(data.sequence_hash);
        }

        if (this.parallelAnalysesThreshold && sentSequenceAnalysesCount % this.parallelAnalysesThreshold === 0) {
            useDataManagementStore.getState().setScrollToSample(this.sequenceImports[data.sequence_hash].fasta_id);
            this.emitSequenceAnalysis();
        }
        const sessionId = useCoreStore.getState().sessionId;
        if (!sessionId) {
            throw new GentrainException("");
        }
        gentrainApiInstance.deleteSequenceAnalysisResultForPathogenAndSession(
            sessionId,
            this.pathogen.id,
            data.sequence_hash
        );
        this.continueIfAllAnalysesAreDone();
    }

    private handleSuccessfulAnalysis = async (sequenceHash: string, sequenceAnalysisResult: any) => {
        await this.persistSequenceAnalysisResult(sequenceHash, sequenceAnalysisResult);
        useDataManagementStore.getState().changeSequenceImport(sequenceHash, { status: "finished" });
    };

    private handleUnsuccessfulAnalysis = (sequenceHash: string) => {
        useDataManagementStore.getState().changeSequenceImport(sequenceHash, {
            status: "failed",
        });
    };

    private async sequenceAnalysisEnqueuedActions(sequenceHash: string) {
        useDataManagementStore.getState().changeSequenceImport(sequenceHash, {
            status: "enqueued",
        });
    }

    private async sequenceAnalysisStartedActions(sequenceHash: string) {
        useDataManagementStore.getState().changeSequenceImport(sequenceHash, {
            status: "started",
        });
    }

    private continueIfAllAnalysesAreDone() {
        // continue with distance calculation if responses for all sequences were returned (success or error)
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        const sequenceHashes = Object.keys(sequenceImports);
        if (
            sequenceHashes.filter(
                (sequenceHash: string) =>
                    sequenceImports[sequenceHash].status === "finished" ||
                    sequenceImports[sequenceHash].status === "failed"
            ).length === sequenceHashes.length
        ) {
            this.continue();
        }
    }

    private continue() {
        useDataManagementStore.getState().setSequenceAnalysisRunning(false);
        useCoreStore.getState().updateCasesWithRelationships();
        this.initDistanceCalculation();
        gentrainWebsocketInstance.stopListenForEvent("sequence_analysis_response");
        gentrainWebsocketInstance.stopListenForEvent("sequence_analysis_enqueued");
        gentrainWebsocketInstance.stopListenForEvent("sequence_analysis_started");
        if (!this.pathogen.pathogen_type) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        gentrainWebsocketInstance.leaveRoom(this.pathogen.pathogen_type?.name);
    }

    public initDistanceCalculation = async () => {
        const distanceCalculationStrategy = await PathogenStrategyManager.getDistanceCalculationStrategy(this.pathogen);
        if (!distanceCalculationStrategy) return;
        await distanceCalculationStrategy.execute();
    };

    private syncPersistedResultsWithDb = async (
        persistedSequenceAnalyses: { result: object; sequence_hash: string }[]
    ) => {
        for (const persistedSequenceAnalysis of persistedSequenceAnalyses) {
            const sequenceAnalysis = await db.sequence_analyses.where({
                sequence_hash: persistedSequenceAnalysis.sequence_hash,
            });
            if (!sequenceAnalysis) continue;
            await this.persistSequenceAnalysisResult(
                persistedSequenceAnalysis.sequence_hash,
                persistedSequenceAnalysis.result
            );
        }
    };

    public persistSequenceAnalysisResult = async (sequenceHash: string, sequenceAnalysisResult: any) => {
        const sequenceAnalysis = await db.sequence_analyses.where({ sequence_hash: sequenceHash }).first();
        if (!sequenceAnalysis) return;
        db.sequence_analyses.update(sequenceAnalysis.id, {
            result: sequenceAnalysisResult,
        });
    };
}
