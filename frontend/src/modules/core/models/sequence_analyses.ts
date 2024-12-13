import { db } from "../infrastructure/database";

interface BacterialAnalysisResult {
    allele_ids: { [gen_id: string]: string };
    allele_hashes: { [gen_id: string]: string };
}

interface ViralAnalysisResult {
    mutations: {
        substitutions: any[];
        deletions: any[];
        insertions: any[];
        missing: any[];
        nonACGTNs: any[];
        alignmentRange: { begin: number; end: number };
    };
}

interface SequenceAnalysisSchema {
    id: number;
    result: ViralAnalysisResult | BacterialAnalysisResult;
    schema: string;
    chewbbaca_version?: string;
    nextclade_version?: string;
    created_at?: Date;
    updated_at?: Date;
}

export const deleteSequenceAnalysisById = async (id: number) => {
    await db.sequence_analyses.delete(id);
};

export type { SequenceAnalysisSchema, ViralAnalysisResult, BacterialAnalysisResult };
