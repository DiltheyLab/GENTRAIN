import { PathogenTypeName } from "@/database/pathogen_types";
import { GentrainException } from "@/exceptions/GentrainException";
import { useAppStore } from "@/stores/app";
import { BacterialDistanceCalculation } from "@/strategies/distance_calculation/BacterialDistanceCalculation";
import { ViralDistanceCalculation } from "@/strategies/distance_calculation/ViralDistanceCalculation";
import { BacterialSampleAnalysis } from "@/strategies/sample_analysis/BacterialSampleAnalysis";
import { ViralSampleAnalysis } from "@/strategies/sample_analysis/ViralSampleAnalysis";

export class PathogenStrategyManager {
    static getDistanceCalculationStrategy = (
        pathogenType: string
    ): BacterialDistanceCalculation | ViralDistanceCalculation => {
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacteria]:
                return new BacterialDistanceCalculation(this.getPathogen());
            default:
                return new ViralDistanceCalculation(this.getPathogen());
        }
    };

    static getSampleAnalysisStrategy = (pathogenType: string): BacterialSampleAnalysis | ViralSampleAnalysis => {
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacteria]:
                return new BacterialSampleAnalysis(this.getPathogen());
            default:
                return new ViralSampleAnalysis(this.getPathogen());
        }
    };

    static getPathogen = () => {
        const activePathogen = useAppStore.getState().activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        return activePathogen;
    };
}
