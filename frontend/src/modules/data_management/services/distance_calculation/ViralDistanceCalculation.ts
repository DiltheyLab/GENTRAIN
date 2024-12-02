import { SampleSchema } from "@/modules/core/models/samples";
import { ViralAnalysisResult } from "@/modules/core/models/sequence_analyses";
import { DistanceCalculationStrategy } from "@/modules/data_management/services/distance_calculation/DistanceCalculationStrategy";
export class ViralDistanceCalculation extends DistanceCalculationStrategy {
    protected calculateSampleDistanceForTwoSamples = async (sample1: SampleSchema, sample2: SampleSchema) => {
        const sequenceAnalysisResult1 = sample1.sequence_analysis?.result as ViralAnalysisResult;
        const sequenceAnalysisResult2 = sample2.sequence_analysis?.result as ViralAnalysisResult;

        try {
            const distance = await fetch(`${import.meta.env.VITE_API_HOST}/distances`, {
                method: "POST",
                body: JSON.stringify({
                    mutations_1: sequenceAnalysisResult1.mutations,
                    mutations_2: sequenceAnalysisResult2.mutations,
                }),
                headers: { "Content-type": "application/json", Accept: "application/json" },
            });
            const response = await distance.json();
            return response;
        } catch (error) {
            console.error("Error fetching distance from server", error);
            throw error;
        }
    };
}
