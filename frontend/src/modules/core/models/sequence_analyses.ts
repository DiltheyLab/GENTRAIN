import { db } from "../infrastructure/database";

interface BacterialAnalysisResult {
    alleles: { [gen_id: string]: string };
}

interface ViralAnalysisResult {
    mutations: {
        substitutions: [];
        deletions: [];
        insertions: [];
        missing: [];
        nonACGTNs: [];
        alignmentRange: { begin: number; end: number };
    };
}

interface SequenceAnalysisSchema {
    id: number;
    result: ViralAnalysisResult | BacterialAnalysisResult;
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
