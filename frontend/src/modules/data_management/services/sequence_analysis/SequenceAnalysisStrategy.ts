import { PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { socket } from "@/modules/core/helpers/socket";
import { CoreState, useCoreStore } from "@/modules/core/stores/core";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { db } from "@/modules/core/infrastructure/database";
import { toSlug } from "@/modules/core/helpers/strings";

export abstract class SequenceAnalysisStrategy {
    protected coreState: CoreState;
    protected dataManagementState: DataManagementState;
    protected pathogen: PathogenWithRelationships;
    protected sampleData: { fastaId: string; sequence: string }[] | undefined;
    protected fastaIdsToAnalyse: string[] = [];
    protected finishedFastaIds: string[] = [];
    protected roomName: string = "";

    protected abstract createSampleAndSequenceAnalysis(
        fastaId: string,
        sequenceAnalysisResult: object,
        sequenceLength?: number
    ): Promise<void>;

    constructor(pathogen: PathogenWithRelationships) {
        this.coreState = useCoreStore.getState();
        this.dataManagementState = useDataManagementStore.getState();
        this.pathogen = pathogen;
    }

    public setSampleData = (sampleData: { fastaId: string; sequence: string }[]) => {
        this.sampleData = sampleData;
    };

    public execute = async () => {
        if (!this.sampleData) {
            console.error("No sample data was provided. Run setSampleData(<sample_data>) first.");
            return;
        }
        this.joinRoomAndRunAnalysis();
        this.handleCompletedAnalyses();
    };

    private joinRoomAndRunAnalysis = () => {
        if (socket) {
            socket.emit(`join_${this.pathogen.pathogen_type?.name}`, this.coreState.session?.id);
            socket.on(`${this.pathogen.pathogen_type?.name}_room_created`, async (roomName: string) => {
                this.roomName = roomName;
                console.log(`Room ${this.roomName} was joined.`);
                await this.runAnalysis();
            });
        }
    };

    private runAnalysis = async () => {
        if (!this.sampleData) {
            return;
        }
        for (const sample of this.sampleData) {
            // skip sample if it was excluded from uploads
            if (!Object.keys(this.dataManagementState.uploads).includes(sample.fastaId)) {
                continue;
            }
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ fasta_id: sample.fastaId }).first();
            // we currently only add samples if a case for the fasta id exists already
            // otherwise we would maximize the necessary amount of variant calculations
            if (sampleCase) {
                this.emitSequenceAnalysisMessage(sample);
                this.fastaIdsToAnalyse.push(sample.fastaId);
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
        if (socket) {
            socket.emit("sequence_analysis_request", this.roomName, toSlug(this.pathogen.name), fastaId, sequence);
        }
    };

    private handleSingleAnalysisResult(data: { fasta_id: string; result: any; sequence_length: number }) {
        this.createSampleAndSequenceAnalysis(data.fasta_id, data.result, data.sequence_length);
        this.dataManagementState.changeUpload(data.fasta_id, "finished");
        this.finishedFastaIds.push(data.fasta_id);
    }

    private continueIfAllAnalysesAreDone() {
        if (this.finishedFastaIds.length === this.fastaIdsToAnalyse.length) {
            this.coreState.updateCasesWithRelationships();
            this.initDistanceCalculation();
            if (socket) {
                console.log(`Room ${this.roomName} was left.`);
                socket.emit(`leave_${this.pathogen.pathogen_type?.name}`, this.coreState.session?.id);
                socket.off("sequence_analysis_response");
            }
        }
    }

    private initDistanceCalculation = async () => {
        const distanceCalculationStrategy = await PathogenStrategyManager.getDistanceCalculationStrategy();
        if (!distanceCalculationStrategy) return;
        await distanceCalculationStrategy.execute();
    };
}
