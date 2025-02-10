import { db } from "@/modules/core/services/database/DatabaseManager";
import { getCasesForPathogenWithSample } from "@/modules/core/models/cases";
import { getOrCreateDistanceMatrixIdByPathogenId } from "@/modules/core/models/distance_matrices";
import { deleteDistancesByPathogenId } from "@/modules/core/models/distances";
import { PathogenSchema } from "@/modules/core/models/pathogens";
import { SampleSchema } from "@/modules/core/models/samples";
import { extractSamplesFromCases } from "@/modules/data_management/helpers/samples";
import { DataManagementStore, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { toast } from "@/modules/core/components/ui/UseToast";

export abstract class DistanceCalculationStrategy {
    protected dataManagementStore: DataManagementStore;
    protected pathogen: PathogenSchema;
    protected distanceMatrixId: number | undefined;
    protected samples: SampleSchema[];

    protected abstract calculateSampleDistanceForTwoSamples(
        sample1: SampleSchema,
        sample2: SampleSchema
    ): Promise<number> | number;

    constructor(pathogen: PathogenSchema) {
        this.dataManagementStore = useDataManagementStore.getState();
        this.pathogen = pathogen;
        this.samples = [];
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
        this.samples = await this.getSamples();
    };

    private getSamples = async () => {
        const cases = await getCasesForPathogenWithSample(this.pathogen.id);
        return extractSamplesFromCases(cases);
    };

    private getDistanceMatrixId = async () => {
        const distanceMatrixId = await getOrCreateDistanceMatrixIdByPathogenId(this.pathogen.id);
        return distanceMatrixId;
    };

    private initProgress = () => {
        const sampleAmount = Object.keys(this.samples).length;
        useDataManagementStore.getState().setDistanceCalculationSum((sampleAmount * (sampleAmount + 1)) / 2);
    };

    private calculateSampleDistances = async () => {
        if (!this.distanceMatrixId) {
            return;
        }
        for (const index in this.samples) {
            const sample1 = this.samples[index];
            // we only calculate distances between current sample and previously iterated samples to minimize calculation count
            // as limit we use the index of the current sample incremented by 1 since the slice-method excludes the end index
            const previousSamples = this.samples.slice(0, +index);
            for (const sample2 of previousSamples) {
                const distance = await this.calculateSampleDistanceForTwoSamples(sample1, sample2);
                await db.distances.add({
                    sample_id_1: sample1.id,
                    sample_id_2: sample2.id,
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
        const sampleImports = useDataManagementStore.getState().sampleImports;
        useDataManagementStore.getState().setFailedSampleImports(
            Object.keys(sampleImports)
                .filter((fastaId) => sampleImports[fastaId].status === "failed")
                .map((fastaId) => fastaId)
        );
        useDataManagementStore.getState().resetSampleUpload();
        if (useDataManagementStore.getState().importAssistentStep === "sequence_analysis") {
            useDataManagementStore.getState().nextImportAssistentStep();
        }
    };
}
