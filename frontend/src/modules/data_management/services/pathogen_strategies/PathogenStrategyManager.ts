import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { PathogenTypeName, getPathogenTypeForActivePathogen } from "@/modules/core/models/pathogen_types";
import { FileReadingStrategy } from "../data_import/file_reading/FileReadingStrategy";
import { MultiFileReading } from "../data_import/file_reading/MultiFileReading";
import { SingleFileReading } from "../data_import/file_reading/SingleFileReading";
import { BacterialDistanceCalculation } from "../distance_calculation/BacterialDistanceCalculation";
import { ViralDistanceCalculation } from "../distance_calculation/ViralDistanceCalculation";
import { ViralSequenceAnalysis } from "@/modules/data_management/services/sequence_analysis/ViralSequenceAnalysis";
import { BacterialSequenceAnalysis } from "@/modules/data_management/services/sequence_analysis/BacterialSequenceAnalysis";
import { useCoreStore } from "@/modules/core/stores/core";

export class PathogenStrategyManager {
    public static getDistanceCalculationStrategy = async (): Promise<
        BacterialDistanceCalculation | ViralDistanceCalculation | undefined
    > => {
        const pathogenType = await this.getPathogenTypeName();
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacterial]:
                return new BacterialDistanceCalculation(this.getPathogen());
            default:
                return new ViralDistanceCalculation(this.getPathogen());
        }
    };

    public static getSequenceAnalysisStrategy = async (): Promise<
        BacterialSequenceAnalysis | ViralSequenceAnalysis | undefined
    > => {
        const pathogenType = await this.getPathogenTypeName();
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacterial]:
                return new BacterialSequenceAnalysis(this.getPathogen());
            default:
                return new ViralSequenceAnalysis(this.getPathogen());
        }
    };

    public static getFileReadingStrategy = async (type: string): Promise<FileReadingStrategy | undefined> => {
        const pathogenType = await this.getPathogenTypeName();
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacterial]:
                return type === "samples" ? new MultiFileReading() : new SingleFileReading();
            default:
                return new SingleFileReading();
        }
    };

    public static getPathogen = () => {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        return activePathogen;
    };

    public static getPathogenTypeName = async () => {
        const activePathogenType = await getPathogenTypeForActivePathogen();
        if (!activePathogenType) {
            return;
        }
        return activePathogenType.name.toString();
    };
}
