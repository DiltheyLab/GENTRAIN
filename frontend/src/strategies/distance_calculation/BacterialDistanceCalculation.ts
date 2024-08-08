import { DistanceCalculationStrategy } from "./DistanceCalculationStrategy";

export class BacterialDistanceCalculation extends DistanceCalculationStrategy {
    protected calculateSampleDistance = () => {
        console.log("bacterial distance calculation");
        return 0;
    };
}
