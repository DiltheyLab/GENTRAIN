import { DistanceCalculationStrategy } from "./DistanceCalculationStrategy";

export class BacterialDistanceCalculation extends DistanceCalculationStrategy {
    calculateSampleDistance = () => {
        console.log("bacterial distance calculation");
        return 0;
    };
}
