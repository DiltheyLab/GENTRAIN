import { db } from "@/database/db";

interface SampleSchema {
    id: number;
    fasta_id: string;
    ims_id: string;
    group: string;
    sequence: string;
<<<<<<< Updated upstream
    n_count: number;
    location_sending_lab: string;
    location_sequencing_lab: string;
    lineage: string;
    variants: object;
    metadata: string;
    sampled_at: Date;
=======
    ims_id?: string;
    n_count?: number;
    lineage?: string;
    variants?: object;
    metadata?: string;
>>>>>>> Stashed changes
    created_at?: Date;
    updated_at?: Date;
}

export const getAllSamples = (): Promise<SampleSchema[] | undefined> => {
    return db.samples.toArray();
};

export type { SampleSchema };
