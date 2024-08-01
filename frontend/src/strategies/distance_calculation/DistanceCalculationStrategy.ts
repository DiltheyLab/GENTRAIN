import { getCasesForPathogenWithSample } from "@/database/cases";
import { getOrCreateDistanceMatrixIdByPathogenId } from "@/database/distance_matrices";
import { PathogenSchema } from "@/database/pathogens";
import { SampleSchema } from "@/database/samples";
import { GentrainException } from "@/exceptions/GentrainException";
import { extractSamplesFromCases } from "@/services/samples";
import { useAppStore } from "@/stores/app";
import { SampleUploadState, useSampleUploadStore } from "@/stores/upload";
import Aioli from "@biowasm/aioli";
import { deleteDistancesByPathogenId } from "@/database/distances";

export abstract class DistanceCalculationStrategy {
    protected sampleUploadState: SampleUploadState;
    protected pathogen: PathogenSchema;
    protected cli: any;
    protected distanceMatrixId: number | undefined;
    protected samples: SampleSchema[];

    constructor() {
        this.sampleUploadState = useSampleUploadStore.getState();
        this.pathogen = this.getPathogen();
        this.samples = [];
    }

    execute = async () => {
        if (!this.cli || !this.distanceMatrixId) await this.init();
        await deleteDistancesByPathogenId(this.pathogen.id);
        this.initProgress();
        await this.calculateSampleDistances();
    };

    abstract calculateSampleDistances(): void;

    init = async () => {
        this.cli = await this.getCli();
        this.distanceMatrixId = await this.getDistanceMatrixId();
        this.samples = await this.getSamples();
    };

    getCli = async () => {
        const cli = await new Aioli(["kalign/3.3.1"]);
        return cli;
    };

    getPathogen = () => {
        const activePathogen = useAppStore.getState().activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        return activePathogen;
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
        const sampleAmount = Object.keys(this.samples).length - 1;
        this.sampleUploadState.setDistanceCalculationSum((sampleAmount * (sampleAmount + 1)) / 2);
    };
}
