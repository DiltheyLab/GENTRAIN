import { db } from "@/modules/core/infrastructure/database";
import { SequenceAnalysisSchema } from "./sequence_analyses";

interface SampleSchema {
    id: number;
    fasta_id: string;
    sequence_analysis_id: number;
    sequence_analysis?: SequenceAnalysisSchema | null;
    n_count?: number;
    ambiguity_character_count?: number;
    undeterminable_gen_count?: number;
    contig_count?: number;
    first_contig_length?: number;
    sequence_length?: number;
    lineage?: string;
    variants?: any;
    metadata?: string;
    created_at?: Date;
    updated_at?: Date;
}

export const deleteSampleById = async (id: number) => {
    await db.samples.delete(id);
};

export type { SampleSchema };
