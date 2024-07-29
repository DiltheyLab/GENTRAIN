import { toast } from "@/components/ui/use-toast";
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
        useSampleUploadStore.getState().addFailedUpload(fastaId);
        return;
    }
    let variantsResult = await response.json();
    createSample(fastaId, sequence, variantsResult);
    useSampleUploadStore.getState().addFinishedUpload(fastaId);
};

export const getAndPersistVariantsForSamplesSynchronously = async (variantsRequests: Promise<void>[]) => {
    await Promise.all(variantsRequests);
    // display an error toast if samples consist of invalid genomic sequences
    if (useSampleUploadStore.getState().failedUploads.length > 0) {
        toast({
            title: "Invalide Sequenzstruktur",
            description: useSampleUploadStore.getState().failedUploads.join(", "),
            duration: 10000,
        });
    }
};

export function samplesByFastaId(samples: SampleSchema[]) {
    const sampleDict: { [fastaId: string]: SampleSchema } = {};
    for (const sample of samples) {
        sampleDict[sample.fasta_id] = sample;
    }
    return sampleDict;
}
