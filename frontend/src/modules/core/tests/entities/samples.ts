import { SampleSchema } from "../../models/samples";
import { TestSequenceAnalysis } from "./sequence_analyses";

export type TestSample = {
    id?: number;
    fasta_id?: string;
    sequence_analysis_id?: number;
    sequence_analysis?: TestSequenceAnalysis | null;
    n_count?: number;
    sequence_length?: number;
    lineage?: string;
    created_at?: Date;
    updated_at?: Date;
};

export const createSample = ({
    id = 0,
    fasta_id = ":fasta_id:",
    sequence_analysis_id = 0,
    n_count = 0,
    sequence_length = 0,
    lineage = ":lineage:",
    created_at = new Date(),
    updated_at = new Date(),
    sequence_analysis = null,
}: TestSample) => {
    return {
        id,
        fasta_id,
        sequence_analysis_id,
        n_count,
        sequence_length,
        lineage,
        created_at,
        updated_at,
        sequence_analysis,
    } as SampleSchema;
};
