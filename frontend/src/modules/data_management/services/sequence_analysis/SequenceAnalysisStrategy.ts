import { PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import gentrainApiInstance from "@/modules/core/adapters/GentrainApi";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket";
import { BacterialQualityParameters, ViralQualityParameters } from "@/modules/core/models/sequence_analyses";
import { SequenceAnalysisCasesSchema } from "@/modules/core/models/sequence_analyses_cases";

export abstract class SequenceAnalysisStrategy {
    protected pathogen: PathogenWithRelationships;
    protected roomName: string;
    protected parallelAnalysesThreshold: number | null = null;

    public abstract getQualityParameters(sequence: string): ViralQualityParameters | BacterialQualityParameters;
    protected abstract emitSequenceAnalysis(): void;

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
        const sequenceAnalysesWithoutResult = await db.sequence_analyses
            .filter((sequenceAnalysis) => !sequenceAnalysis.result)
            .toArray();
        const results: { result: object; fasta_hash: string }[] = [];
        for (const sequenceAnalysis of sequenceAnalysesWithoutResult) {
            const result = await gentrainApiInstance.getPersistedSequenceAnalysisResult(sequenceAnalysis);
            if (!result) continue;
            results.push({ result: result, fasta_hash: sequenceAnalysis.fasta_hash });
        }
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
        const newCaseMappings: SequenceAnalysisCasesSchema[] = [];
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        for (const fastaHash in sequenceImports) {
            const sequenceImport = sequenceImports[fastaHash];
            const existingSequenceAnalysis = await db.sequence_analyses.where({ fasta_hash: fastaHash }).first();
            let sequenceAnalysisId = existingSequenceAnalysis?.id;
            if (existingSequenceAnalysis && existingSequenceAnalysis.result) {
                // mark sequence analysis as successful if a result for the provided hash already exists
                useDataManagementStore.getState().changeSequenceImport(fastaHash, {
                    status: "finished",
                });
            } else {
                // create a new sequence analysis object if not result is available for the provided sequence hash
                sequenceAnalysisId = await db.sequence_analyses.add({
                    fasta_hash: fastaHash,
                    pathogen_id: useCoreStore.getState().activePathogen!.id,
                });
            }
            for (const fastaId of sequenceImport.fasta_ids) {
                const caseMapping = await db.sequence_analyses_cases
                    .where({ sequence_analysis_id: sequenceAnalysisId, fasta_id: fastaId })
                    .first();
                // create a mapping between existing sequence analysis id and fasta id if it does not already exist
                // a sequence may be associated with mutiple cases via fasta ids
                if (!caseMapping && sequenceAnalysisId) {
                    newCaseMappings.push({
                        sequence_analysis_id: sequenceAnalysisId,
                        fasta_id: fastaId,
                    } as SequenceAnalysisCasesSchema);
                }
            }
        }
        db.sequence_analyses_cases.bulkAdd(newCaseMappings);
        this.emitSequenceAnalysis();
        this.continueIfAllAnalysesAreDone();
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
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        const sentSequenceAnalysesCount = Object.keys(sequenceImports).map(
            (fastaHash) => sequenceImports[fastaHash].status === "sent"
        ).length;
        if (data.status === "success") {
            await this.handleSuccessfulAnalysis(data.fasta_hash, data.result);
        }
        if (data.status === "error") {
            this.handleUnsuccessfulAnalysis(data.fasta_hash);
        }

        if (this.parallelAnalysesThreshold && sentSequenceAnalysesCount % this.parallelAnalysesThreshold === 0) {
            useDataManagementStore.getState().setScrollToSequence(data.fasta_hash);
            this.emitSequenceAnalysis();
        }
        gentrainApiInstance.deleteSequenceAnalysisResultForHash(data.fasta_hash);
        this.continueIfAllAnalysesAreDone();
    }

    private handleSuccessfulAnalysis = async (fastaHash: string, sequenceAnalysisResult: any) => {
        await this.persistSequenceAnalysisResult(fastaHash, sequenceAnalysisResult);
        useDataManagementStore.getState().changeSequenceImport(fastaHash, { status: "finished" });
    };

    private handleUnsuccessfulAnalysis = (fastaHash: string) => {
        useDataManagementStore.getState().changeSequenceImport(fastaHash, {
            status: "failed",
        });
    };

    private async sequenceAnalysisEnqueuedActions(fastaHash: string) {
        useDataManagementStore.getState().changeSequenceImport(fastaHash, {
            status: "enqueued",
        });
    }

    private async sequenceAnalysisStartedActions(fastaHash: string) {
        useDataManagementStore.getState().changeSequenceImport(fastaHash, {
            status: "started",
        });
    }

    private continueIfAllAnalysesAreDone() {
        // continue with distance calculation if responses for all sequences were returned (success or error)
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        const fastaHashes = Object.keys(sequenceImports);
        if (
            fastaHashes.filter(
                (fastaHash: string) =>
                    sequenceImports[fastaHash].status === "finished" || sequenceImports[fastaHash].status === "failed"
            ).length === fastaHashes.length
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
        persistedSequenceAnalyses: { result: object; fasta_hash: string }[]
    ) => {
        for (const persistedSequenceAnalysis of persistedSequenceAnalyses) {
            const sequenceAnalysis = await db.sequence_analyses.where({
                fasta_hash: persistedSequenceAnalysis.fasta_hash,
            });
            if (!sequenceAnalysis) continue;
            await this.persistSequenceAnalysisResult(
                persistedSequenceAnalysis.fasta_hash,
                persistedSequenceAnalysis.result
            );
            gentrainApiInstance.deleteSequenceAnalysisResultForHash(persistedSequenceAnalysis.fasta_hash);
        }
    };

    public persistSequenceAnalysisResult = async (fastaHash: string, sequenceAnalysisResult: any) => {
        const sequenceAnalysis = await db.sequence_analyses.where({ fasta_hash: fastaHash }).first();
        if (!sequenceAnalysis) return;
        db.sequence_analyses.update(sequenceAnalysis.id, {
            result: sequenceAnalysisResult,
        });
    };
}
