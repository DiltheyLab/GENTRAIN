import { db } from "@/modules/core/infrastructure/database";
import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";

export class BacterialSequenceAnalysis extends SequenceAnalysisStrategy {
    protected createSampleAndSequenceAnalysis = async (fastaId: string, sequenceAnalysisResult: any) => {
        const sequenceAnalysisId = await db.sequence_analyses.add({
            schema: sequenceAnalysisResult["analysis_schema"],
            version: sequenceAnalysisResult["chewBACCA_version"],
            result: {
                alleles: sequenceAnalysisResult["alleles"],
            },
        });
        await db.samples.add({
            fasta_id: fastaId,
            sequence_analysis_id: sequenceAnalysisId,
        });
    };
}
