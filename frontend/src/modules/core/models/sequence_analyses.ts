interface BacterialAnalysisResult {
    sequence_length: number;
    alleles: { [gen_id: string]: string };
}

interface ViralAnalysisResult {
    sequence_length: number;
    lineage: string;
    n_count: number;
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
    schema: string;
    created_at?: Date;
    updated_at?: Date;
}

export type { SequenceAnalysisSchema, ViralAnalysisResult, BacterialAnalysisResult };
