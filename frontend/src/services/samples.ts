import { createSample, SampleSchema } from "@/database/samples";
import { useSampleUploadStore } from "@/stores/upload";

export const getAndPersistVariantsForSample = async ({ fastaId, sequence }: { fastaId: string; sequence: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/data/nextclade`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "Basic " + btoa(`${import.meta.env.VITE_HTBASIC_USERNAME}:${import.meta.env.VITE_HTBASIC_PASSWORD}`),
        },
        body: JSON.stringify({ fasta_content: `>0\n${sequence}` }),
    });
    let variantsResult = await response.json();
    createSample(fastaId, sequence, variantsResult.results[0]);
    useSampleUploadStore.getState().addFinishedUpload(fastaId);
};

export const getAndPersistVariantsForSamplesSynchronously = async (variantsRequests: Promise<void>[]) => {
    await Promise.all(variantsRequests);
};

export function samplesByFastaId(samples: SampleSchema[]) {
    const sampleDict: { [fastaId: string]: SampleSchema } = {};
    for (const sample of samples) {
        sampleDict[sample.fasta_id] = sample;
    }
    return sampleDict;
}
