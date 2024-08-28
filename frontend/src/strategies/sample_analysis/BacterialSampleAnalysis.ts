import { db } from "@/core/infrastructure/database";
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
    getAndPersistVariantsForSamples = async () => {
        if (!this.sampleData) {
            return;
        }
        const variantRequestPromises: Promise<void>[] = [];
        for (const sample of this.sampleData) {
            // skip sample if it was excluded from uploads
            if (!Object.keys(this.sampleUploadState.uploads).includes(sample.fastaId)) {
                continue;
            }
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ fasta_id: sample.fastaId }).first();
            // we currently only add samples if a case for the fasta id exists already
            // otherwise we would maximize the necessary amount of variant calculations
            if (sampleCase) {
                variantRequestPromises.push(this.getAndPersistVariantsForSample(sample));
            }
        }
        await Promise.all(variantRequestPromises);
    };
}
