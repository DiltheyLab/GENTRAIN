import { db } from "@/database/db";

interface SampleSchema {
    id: number;
    fasta_id: string;
    sequence: string;
    ims_id?: string;
    n_count?: number;
    lineage?: string;
    variants?: object;
    metadata?: string;
    created_at?: Date;
    updated_at?: Date;
}

export const getAllSamples = (): Promise<SampleSchema[] | undefined> => {
    return db.samples.toArray();
};

export type { SampleSchema };
