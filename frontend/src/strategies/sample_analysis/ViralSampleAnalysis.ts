import { db } from "@/database/db";
import { SampleAnalysisStrategy } from "./SampleAnalysisStrategy";

export class ViralSampleAnalysis extends SampleAnalysisStrategy {
    createSample = async (fastaId: string, sequence: string, variantsResult: any) => {
        const sampleId = await db.samples.add({
            fasta_id: fastaId,
            sequence_length: sequence.length,
            lineage: variantsResult["lineage"],
            n_count: variantsResult["n_count"],
            variants: {
                substitutions: variantsResult["substitutions"],
                deletions: variantsResult["deletions"],
                insertions: variantsResult["insertions"],
                missing: variantsResult["missing"],
                nonACGTNs: variantsResult["nonACGTNs"],
                alignmentRange: variantsResult["alignmentRange"],
            },
        });
        return sampleId;
    };
}
