import { SampleSchema } from "@/database/samples";
import { DistanceCalculationStrategy } from "./DistanceCalculationStrategy";

export class BacterialDistanceCalculation extends DistanceCalculationStrategy {
    protected calculateSampleDistance = (sample1: SampleSchema, sample2: SampleSchema) => {
        if (!sample1.variants || !sample2.variants) return 0;
        let distance = 0;
        for (const gen of Object.keys(sample1.variants)) {
            const allele1 = sample1.variants[gen];
            const allele2 = sample2.variants[gen];
            if (allele1 === "-" || allele2 === "-") {
                continue;
            }
            if (allele1 === allele2) {
                continue;
            }
            distance += 1;
        }
        return distance;
    };
}
