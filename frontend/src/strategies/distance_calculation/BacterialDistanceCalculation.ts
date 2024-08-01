import { DistanceCalculationStrategy } from "./DistanceCalculationStrategy";

export class BacterialDistanceCalculation extends DistanceCalculationStrategy {
    calculateSampleDistances = () => {
        console.log("bacterial distance calculation");
    };
}
