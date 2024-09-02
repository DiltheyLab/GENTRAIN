import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { PathogenTypeName, getPathogenTypeForActivePathogen } from "@/modules/core/models/pathogen_types";
import { FileReadingStrategy } from "../data_upload/file_reading/FileReadingStrategy";
import { MultiFileReading } from "../data_upload/file_reading/MultiFileReading";
import { SingleFileReading } from "../data_upload/file_reading/SingleFileReading";
import { BacterialDistanceCalculation } from "../distance_calculation/BacterialDistanceCalculation";
import { ViralDistanceCalculation } from "../distance_calculation/ViralDistanceCalculation";
import { ViralSequenceAnalysis } from "@/modules/data_management/services/sequence_analysis/ViralSequenceAnalysis";
import { BacterialSequenceAnalysis } from "@/modules/data_management/services/sequence_analysis/BacterialSequenceAnalysis";
import { useCoreStore } from "@/modules/core/stores/core";

export class PathogenStrategyManager {
    static getDistanceCalculationStrategy = async (): Promise<
        BacterialDistanceCalculation | ViralDistanceCalculation | undefined
    > => {
        const pathogenType = await this.getPathogenTypeName();
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacteria]:
                return new BacterialDistanceCalculation(this.getPathogen());
            default:
                return new ViralDistanceCalculation(this.getPathogen());
        }
    };

    static getSequenceAnalysisStrategy = async (): Promise<
        BacterialSequenceAnalysis | ViralSequenceAnalysis | undefined
    > => {
        const pathogenType = await this.getPathogenTypeName();
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacteria]:
                return new BacterialSequenceAnalysis(this.getPathogen());
            default:
                return new ViralSequenceAnalysis(this.getPathogen());
        }
    };

    static getFileReadingStrategy = async (): Promise<FileReadingStrategy | undefined> => {
        const pathogenType = await this.getPathogenTypeName();
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacteria]:
                return new MultiFileReading();
            default:
                return new SingleFileReading();
        }
    };

    static getPathogen = () => {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        return activePathogen;
    };

    static getPathogenTypeName = async () => {
        const activePathogenType = await getPathogenTypeForActivePathogen();
        if (!activePathogenType) {
            return;
        }
        return activePathogenType.name.toString();
    };
}
