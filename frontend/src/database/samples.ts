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

export const createSample = async (fastaId: string, sequence: string, variantsResult: any) => {
    const sampleId = await db.samples.add({
        fasta_id: fastaId,
        sequence_length: sequence.length,
        lineage: variantsResult["lineage"],
        n_count: variantsResult["n_count"],
        variants: {
            substitutions: variantsResult["substitutions"],
            deletions: variantsResult["deletions"],
            insertions: variantsResult["insertions"],
            missing: variantsResult["missing"],
            nonACGTNs: variantsResult["nonACGTNs"],
            alignmentStart: variantsResult["alignmentStart"],
            alignmentEnd: variantsResult["alignmentEnd"],
        },
    });
    return sampleId;
};

export const deleteSampleById = async (id: number) => {
    await db.samples.delete(id);
};

export type { SampleSchema };
