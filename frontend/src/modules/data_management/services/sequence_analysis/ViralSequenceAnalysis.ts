import { db } from "@/modules/core/infrastructure/database";
import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";

export class ViralSequenceAnalysis extends SequenceAnalysisStrategy {
    protected createSampleAndSequenceAnalysis = async (
        fastaId: string,
        sequenceAnalysisResult: any,
        sequenceLength: number
    ) => {
        const sequenceAnalysisId = await db.sequence_analyses.add({
            schema: "nextclade",
            result: {
                sequence_length: sequenceLength,
                lineage: sequenceAnalysisResult["lineage"],
                n_count: sequenceAnalysisResult["n_count"],
                mutations: {
                    substitutions: sequenceAnalysisResult["substitutions"],
                    deletions: sequenceAnalysisResult["deletions"],
                    insertions: sequenceAnalysisResult["insertions"],
                    missing: sequenceAnalysisResult["missing"],
                    nonACGTNs: sequenceAnalysisResult["nonACGTNs"],
                    alignmentRange: sequenceAnalysisResult["alignmentRange"],
                },
            },
        });
        await db.samples.add({
            fasta_id: fastaId,
            sequence_analysis_id: sequenceAnalysisId,
        });
    };
}
