import { getCasesForPathogenWithSample } from "@/database/cases";
import { getOrCreateDistanceMatrixIdByPathogenId } from "@/database/distance_matrices";
import { PathogenSchema } from "@/database/pathogens";
import { SampleSchema } from "@/database/samples";
import { extractSamplesFromCases } from "@/services/samples";
import { SampleUploadState, useSampleUploadStore } from "@/stores/upload";
import Aioli from "@biowasm/aioli";
import { deleteDistancesByPathogenId } from "@/database/distances";
import { db } from "@/database/db";

export abstract class DistanceCalculationStrategy {
    protected sampleUploadState: SampleUploadState;
    protected pathogen: PathogenSchema;
    protected cli: any;
    protected distanceMatrixId: number | undefined;
    protected samples: SampleSchema[];

    abstract calculateSampleDistance(sample1: SampleSchema, sample2: SampleSchema): Promise<number> | number;

    constructor(pathogen: PathogenSchema) {
        this.sampleUploadState = useSampleUploadStore.getState();
        this.pathogen = pathogen;
        this.samples = [];
    }

    execute = async () => {
        if (!this.cli || !this.distanceMatrixId) await this.init();
        await deleteDistancesByPathogenId(this.pathogen.id);
        this.initProgress();
        console.time("calc");
        await this.calculateSampleDistances();
        console.timeEnd("calc");
    };

    init = async () => {
        this.cli = await this.getCli();
        this.distanceMatrixId = await this.getDistanceMatrixId();
        this.samples = await this.getSamples();
    };

    getCli = async () => {
        const cli = await new Aioli(["kalign/3.3.1"]);
        return cli;
    };

    getSamples = async () => {
        const cases = await getCasesForPathogenWithSample(this.pathogen.id);
        return extractSamplesFromCases(cases);
    };

    getDistanceMatrixId = async () => {
        const distanceMatrixId = await getOrCreateDistanceMatrixIdByPathogenId(this.pathogen.id);
        return distanceMatrixId;
    };

    initProgress = () => {
        const sampleAmount = Object.keys(this.samples).length;
        this.sampleUploadState.setDistanceCalculationSum((sampleAmount * (sampleAmount + 1)) / 2);
    };

    calculateSampleDistances = async () => {
        if (!this.distanceMatrixId) {
            return;
        }
        for (const index in this.samples) {
            const sample1 = this.samples[index];
            // we only calculate distances between current sample and previously iterated samples to minimize calculation count
            // as limit we use the index of the current sample incremented by 1 since slice excludes the end index
            const previousSamples = this.samples.slice(0, parseInt(index));
            for (const sample2 of previousSamples) {
                const distance = await this.calculateSampleDistance(sample1, sample2);
                await db.distances.add({
                    sample_id_1: sample1.id,
                    sample_id_2: sample2.id,
                    value: distance,
                    distance_matrix_id: this.distanceMatrixId,
                });
            }
            useSampleUploadStore.getState().incrementDistanceCalculationCount();
        }
    };
}
