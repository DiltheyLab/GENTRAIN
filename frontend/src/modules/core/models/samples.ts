import { db } from "@/modules/core/services/database/DatabaseManager";
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

export type SampleImport = {
    fasta_id?: string;
    case_id: string;
    sequence: string;
    sequence_length?: number;
    n_count?: number;
    ambiguity_character_count?: number;
    contig_count?: number;
    first_contig_length?: number;
};

export type ViralQualityParameters = {
    sequence_length: number;
    n_count: number;
    ambiguity_character_count: number;
    lineage?: string;
};

export type BacterialQualityParameters = {
    contig_count: number;
    first_contig_length: number;
};

export const deleteSampleById = async (id: number) => {
    await db.samples.delete(id);
};

export const deleteSampleByFastaId = async (fasta_id: string) => {
    const sample = await db.samples.where({ fasta_id: fasta_id }).first();
    if (!sample) return;
    await db.sequence_analyses.delete(sample.id);
    await db.distances.where({ sample_id_1: sample.id }).or("sample_id_2").equals(sample.id).delete();
    await db.samples.delete(sample.id);
};

export type { SampleSchema };
