import { db } from "@/database/db";

interface SampleSchema {
    id: number;
    fasta_id: string;
    ims_id?: string;
    n_count?: number;
    sequence_length?: number;
    lineage?: string;
    variants?: VariantSchema;
    metadata?: string;
    created_at?: Date;
    updated_at?: Date;
}
interface VariantSchema {
    substitutions: any[];
    deletions: any[];
    insertions: any[];
    missing: any[];
    nonACGTNs: any[];
    alignmentStart: number;
    alignmentEnd: number;
}

export const getAllSamples = (): Promise<SampleSchema[] | undefined> => {
    return db.samples.toArray();
};

export const deleteSampleById = async (id: number) => {
    await db.samples.delete(id);
};

export type { SampleSchema };
