import { PathogenWithRelationships } from "@/database/pathogens";
import { SampleUploadState, useSampleUploadStore } from "@/stores/upload";
import { db } from "@/database/db";

export abstract class SampleAnalysisStrategy {
    protected sampleUploadState: SampleUploadState;
    protected pathogen: PathogenWithRelationships;
    protected sampleData: { fastaId: string; sequence: string }[] | undefined;

    abstract createSample(fastaId: string, sequence: string, variantsResult: object): void;

    constructor(pathogen: PathogenWithRelationships) {
        this.sampleUploadState = useSampleUploadStore.getState();
        this.pathogen = pathogen;
    }

    setSampleData = (sampleData: { fastaId: string; sequence: string }[]) => {
        this.sampleData = sampleData;
    };

    execute = async () => {
        if (!this.sampleData) {
            console.error("No sample data was provided. Run setSampleData(<sample_data>) first.");
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
        await this.getAndPersistVariantsForSamplesSynchronously(variantRequestPromises);
    };

    getAndPersistVariantsForSample = async ({ fastaId, sequence }: { fastaId: string; sequence: string }) => {
        const pathogenName = encodeURI(this.pathogen.name).toLowerCase();
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
            this.sampleUploadState.changeUpload(fastaId, "failed");
            return;
        }
        let variantsResult = await response.json();
        this.createSample(fastaId, sequence, variantsResult);
        this.sampleUploadState.changeUpload(fastaId, "finished");
    };

    getAndPersistVariantsForSamplesSynchronously = async (variantsRequests: Promise<void>[]) => {
        await Promise.all(variantsRequests);
    };
}
