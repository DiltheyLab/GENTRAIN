import { CaseWithRelationships } from "@/database/cases";
import { createSample, SampleSchema } from "@/database/samples";
import { useAppStore } from "@/stores/app";
import { useSampleUploadStore } from "@/stores/upload";

export const getAndPersistVariantsForSample = async ({ fastaId, sequence }: { fastaId: string; sequence: string }) => {
    const activePathogen = useAppStore.getState().activePathogen;
    if (!activePathogen) {
        return;
    }
    const pathogenName = encodeURI(activePathogen.name).toLowerCase();
    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/pathogens/${pathogenName}/sequences/${fastaId}/variants`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Basic " +
                    btoa(`${import.meta.env.VITE_HTBASIC_USERNAME}:${import.meta.env.VITE_HTBASIC_PASSWORD}`),
            },
            body: JSON.stringify({ sequence: sequence }),
        }
    );
    if (response.status === 422) {
        // on validation error add fasta ifs to list of failed upload in order to display meaningful toast message
        useSampleUploadStore.getState().changeUpload(fastaId, "failed");
        return;
    }
    let variantsResult = await response.json();
    createSample(fastaId, sequence, variantsResult);
    useSampleUploadStore.getState().changeUpload(fastaId, "finished");
};

export const getAndPersistVariantsForSamplesSynchronously = async (variantsRequests: Promise<void>[]) => {
    await Promise.all(variantsRequests);
};

export function getSampleDictionary(samples: SampleSchema[]) {
    const sampleDictionary: { [id: string]: SampleSchema } = {};
    for (const sample of samples) {
        sampleDictionary[sample.id] = sample;
    }
    return sampleDictionary;
}

export function extractSamplesFromCases(cases: CaseWithRelationships[]) {
    const samples: SampleSchema[] = [];
    for (const caseData of cases) {
        if (caseData.sample) {
            samples.push(caseData.sample);
        }
    }
    return samples.sort();
}
