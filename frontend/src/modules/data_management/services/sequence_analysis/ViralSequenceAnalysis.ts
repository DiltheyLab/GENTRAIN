import { db } from "@/modules/core/infrastructure/database";
import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";

export class ViralSequenceAnalysis extends SequenceAnalysisStrategy {
    public createSampleAndSequenceAnalysis = async (
        fastaId: string,
        sequenceAnalysisResult: any,
        sequenceLength: number
    ) => {
        const sequenceAnalysisId = await db.sequence_analyses.add({
            schema: sequenceAnalysisResult["analysis_schema"],
            nextclade_version: sequenceAnalysisResult["nextclade_version"],
            result: {
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
            sequence_length: sequenceLength,
            lineage: sequenceAnalysisResult["lineage"],
            n_count: sequenceAnalysisResult["n_count"],
            sequence_analysis_id: sequenceAnalysisId,
        });
    };

    public getQualityParameters = (sequence: string) => {
        const nCount = (sequence.match(/N/g) || []).length;
        const ambiguityCharacterCount = (sequence.match(/[BDHKMRSUVWY]/g) || []).length;
        return {
            sequence_length: sequence.length,
            n_count: nCount,
            ambiguity_character_count: ambiguityCharacterCount,
        };
    };
}
