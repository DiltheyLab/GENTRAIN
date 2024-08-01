import { PathogenTypeName } from "@/database/pathogen_types";
import { BacterialDistanceCalculation } from "./BacterialDistanceCalculation";
import { ViralDistanceCalculation } from "./ViralDistanceCalculation";

export class DistanceCalculationStrategyManager {
    static getStrategyForPathogenType = (
        pathogenType: string
    ): BacterialDistanceCalculation | ViralDistanceCalculation => {
        switch (pathogenType) {
            case PathogenTypeName[PathogenTypeName.bacteria]:
                return new BacterialDistanceCalculation();
            default:
                return new ViralDistanceCalculation();
        }
    };
}
