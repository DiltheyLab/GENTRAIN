import { db } from "@/database/db";
import { SampleAnalysisStrategy } from "./SampleAnalysisStrategy";

export class BacterialSampleAnalysis extends SampleAnalysisStrategy {
    createSample = async (fastaId: string, sequence: string, variantsResult: any) => {
        const sampleId = await db.samples.add({
            fasta_id: fastaId,
            sequence_length: sequence.length,
            variants: variantsResult,
        });
        return sampleId;
    };
}
