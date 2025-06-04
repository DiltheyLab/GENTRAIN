import { db } from "../services/database/DatabaseManager";
export interface SequenceSchema {
    id: number;
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

export type SequenceImport = {
    fasta_id: string;
    sequence: string;
    sequence_length?: number;
    n_count?: number;
    ambiguity_character_count?: number;
    contig_count?: number;
    first_contig_length?: number;
    status: string;
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
interface BacterialAnalysisResult {
    allele_ids: { [gen_id: string]: string };
    allele_hashes: { [gen_id: string]: string };
    contig_count: number;
    first_contig_length: number;
    undeterminable_gen_count: number;
}

interface ViralAnalysisResult {
    substitutions: any[];
    deletions: any[];
    insertions: any[];
    missing: any[];
    nonACGTNs: any[];
    alignmentRange: { begin: number; end: number };
    sequence_length: number;
    n_count: number;
    ambiguity_character_count: number;
    lineage: string;
}

interface SequenceAnalysisSchema {
    id: number;
    sequence_hash: string;
    pathogen_id: number;
    result?: ViralAnalysisResult | BacterialAnalysisResult;
    schema?: string;
    chewbbaca_version?: string;
    nextclade_version?: string;
    created_at?: Date;
    updated_at?: Date;
}

export const deleteSequenceAnalysisById = async (id: number) => {
    await db.sequence_analyses.delete(id);
};

export type { SequenceAnalysisSchema, ViralAnalysisResult, BacterialAnalysisResult };
