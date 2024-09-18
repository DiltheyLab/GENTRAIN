import { SampleSchema } from "@/modules/core/models/samples";
import { BacterialAnalysisResult } from "@/modules/core/models/sequence_analyses";
import { DistanceCalculationStrategy } from "@/modules/data_management/services/distance_calculation/DistanceCalculationStrategy";

export class BacterialDistanceCalculation extends DistanceCalculationStrategy {
    protected calculateSampleDistance = (sample1: SampleSchema, sample2: SampleSchema) => {
        const sequenceAnalysisResult1 = sample1.sequence_analysis?.result as BacterialAnalysisResult;
        const sequenceAnalysisResult2 = sample2.sequence_analysis?.result as BacterialAnalysisResult;
        if (!sequenceAnalysisResult1 || !sequenceAnalysisResult2) return 0;
        let distance = 0;

        for (const gen of Object.keys(sequenceAnalysisResult1.allele_hashes)) {
            const allele1 = sequenceAnalysisResult1.allele_hashes[gen];
            const allele2 = sequenceAnalysisResult2.allele_hashes[gen];
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
