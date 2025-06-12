import { SequenceAnalysisSchema } from "../../models/sequence_analyses";

export const createSequenceAnalysis = (overrides: Partial<SequenceAnalysisSchema>) => {
    return {
        id: 0,
        case_id: ":case_id:",
        fasta_id: ":fasta_id:",
        sequence: ":sequence:",
        analysis_type: "default",
        created_at: new Date(),
        updated_at: new Date(),
        ...overrides,
    } as SequenceAnalysisSchema;
};
