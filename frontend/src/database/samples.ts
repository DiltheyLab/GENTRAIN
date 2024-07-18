import { db } from "@/database/db";

interface SampleSchema {
    id: number;
    fasta_id: string;
    ims_id?: string;
    n_count?: number;
    sequence_length?: number;
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
