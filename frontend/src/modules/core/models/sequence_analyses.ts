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
    version: string;
    created_at?: Date;
    updated_at?: Date;
}

export type { SequenceAnalysisSchema, ViralAnalysisResult, BacterialAnalysisResult };
