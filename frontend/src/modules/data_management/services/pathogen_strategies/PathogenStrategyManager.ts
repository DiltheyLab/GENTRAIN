import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { PathogenTypeName, getPathogenTypeForPathogen } from "@/modules/core/models/pathogen_types";
import { BacterialDistanceCalculation } from "../distance_calculation/BacterialDistanceCalculation";
import { ViralDistanceCalculation } from "../distance_calculation/ViralDistanceCalculation";
import { ViralSequenceAnalysis } from "@/modules/data_management/services/sequence_analysis/ViralSequenceAnalysis";
import { BacterialSequenceAnalysis } from "@/modules/data_management/services/sequence_analysis/BacterialSequenceAnalysis";
import { useCoreStore } from "@/modules/core/stores/core";
import { FileReadingStrategy } from "../data_import/file_reading/FileReadingStrategy";
import { SingleFileReading } from "../data_import/file_reading/SingleFileReading";
import { MultiFileReading } from "../data_import/file_reading/MultiFileReading";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";

export class PathogenStrategyManager {
    public static getDistanceCalculationStrategy = async (
        pathogen: PathogenSchema
    ): Promise<BacterialDistanceCalculation | ViralDistanceCalculation | undefined> => {
        const pathogenType = await this.getPathogenTypeName(pathogen);
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacterial]:
                return new BacterialDistanceCalculation(pathogen);
            default:
                return new ViralDistanceCalculation(pathogen);
        }
    };

    // For strategy retrieval from worker files
    public static getSequenceAnalysisStrategyWithoutZustand = (pathogen: PathogenWithRelationships):
        BacterialSequenceAnalysis | ViralSequenceAnalysis => {
        if (!pathogen.pathogen_type) {
            throw new GentrainException("InvalidPathogenType");
        }
        switch (pathogen.pathogen_type.name) {
            case PathogenTypeName[PathogenTypeName.bacterial]:
                return new BacterialSequenceAnalysis(pathogen);
            case PathogenTypeName[PathogenTypeName.viral]:
                return new ViralSequenceAnalysis(pathogen);
            default:
                throw new GentrainException("InvalidPathogenType");
        }
    };

    public static getSequenceAnalysisStrategy = async (): Promise<
        BacterialSequenceAnalysis | ViralSequenceAnalysis | undefined
    > => {
        const pathogen = useCoreStore.getState().activePathogen;
        if (!pathogen) return;
        const pathogenType = await this.getPathogenTypeName(pathogen);
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacterial]:
                return new BacterialSequenceAnalysis(pathogen);
            default:
                return new ViralSequenceAnalysis(pathogen);
        }
    };

    public static getFileReadingStrategy = async (
        type: string,
        pathogen: PathogenSchema
    ): Promise<FileReadingStrategy | undefined> => {
        const pathogenType = await this.getPathogenTypeName(pathogen);
        if (!pathogenType) {
            return;
        }
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacterial]:
                return type === "sequence" ? new MultiFileReading() : new SingleFileReading();
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

    public static getPathogenTypeName = async (pathogen: PathogenSchema) => {
        const activePathogenType = await getPathogenTypeForPathogen(pathogen);
        if (!activePathogenType) {
            return;
        }
        return activePathogenType.name.toString();
    };
}
