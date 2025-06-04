import { db } from "@/modules/core/services/database/DatabaseManager";
import {
    CaseSchema,
    CaseWithRelationships,
    getCasesForPathogenWithSequenceAnalysis,
} from "@/modules/core/models/cases";
import { getOrCreateDistanceMatrixIdByPathogenId } from "@/modules/core/models/distance_matrices";
import { deleteDistancesByPathogenId } from "@/modules/core/models/distances";
import { PathogenSchema } from "@/modules/core/models/pathogens";
import { DataManagementStore, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { toast } from "@/modules/core/components/ui/UseToast";

export abstract class DistanceCalculationStrategy {
    protected dataManagementStore: DataManagementStore;
    protected pathogen: PathogenSchema;
    protected distanceMatrixId: number | undefined;
    protected cases: CaseSchema[];

    protected abstract calculateGeneticDistanceForTwoCases(
        case1: CaseSchema,
        case2: CaseSchema
    ): Promise<number | null> | number | null;

    constructor(pathogen: PathogenSchema) {
        this.dataManagementStore = useDataManagementStore.getState();
        this.pathogen = pathogen;
        this.cases = [];
    }

    public execute = async () => {
        this.dataManagementStore.setDistanceCalculationRunning(true);
        if (!this.distanceMatrixId) await this.init();
        await deleteDistancesByPathogenId(this.pathogen.id);
        this.initProgress();
        await this.calculateSampleDistances();
    };

    private init = async () => {
        this.distanceMatrixId = await this.getDistanceMatrixId();
        this.cases = await this.getCases();
    };

    private getCases = async () => {
        const cases = await getCasesForPathogenWithSequenceAnalysis(this.pathogen.id);
        const casesWithSequenceAnalysis = cases.filter(
            (currentCase: CaseWithRelationships) => currentCase.sequence_analysis
        );
        return casesWithSequenceAnalysis;
    };

    private getDistanceMatrixId = async () => {
        const distanceMatrixId = await getOrCreateDistanceMatrixIdByPathogenId(this.pathogen.id);
        return distanceMatrixId;
    };

    private initProgress = () => {
        const caseAmount = Object.keys(this.cases).length;
        useDataManagementStore.getState().setDistanceCalculationSum((caseAmount * (caseAmount + 1)) / 2);
    };

    private calculateSampleDistances = async () => {
        if (!this.distanceMatrixId) {
            return;
        }
        for (const index in this.cases) {
            const case1 = this.cases[index];
            // we only calculate distances between current sample and previously iterated samples to minimize calculation count
            // as limit we use the index of the current sample incremented by 1 since the slice-method excludes the end index
            const previousCases = this.cases.slice(0, +index);
            for (const case2 of previousCases) {
                const distance = await this.calculateGeneticDistanceForTwoCases(case1, case2);
                if (distance === null || distance === undefined) continue;
                await db.distances.add({
                    case_id_1: case1.id,
                    case_id_2: case2.id,
                    value: distance,
                    distance_matrix_id: this.distanceMatrixId,
                });
            }
            useDataManagementStore.getState().incrementDistanceCalculationCount();
        }
        this.handleCompletedCalculation();
    };

    private handleCompletedCalculation = () => {
        toast({
            title: "Datei wurde erfolgreich hochgeladen",
            duration: 5000,
            variant: "success",
        });
        useDataManagementStore.getState().setDistanceCalculationRunning(false);
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        useDataManagementStore.getState().setFailedSampleImports(
            Object.keys(sequenceImports)
                .filter((fastaId) => sequenceImports[fastaId].status === "failed")
                .map((fastaId) => fastaId)
        );
        useDataManagementStore.getState().resetSampleUpload();
        if (useDataManagementStore.getState().importAssistentStep === "sequence_analysis") {
            useDataManagementStore.getState().nextImportAssistentStep();
        }
    };
}
