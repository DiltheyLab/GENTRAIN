import { db } from "@/modules/core/infrastructure/database";
import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";

export class BacterialSequenceAnalysis extends SequenceAnalysisStrategy {
    public createSampleAndSequenceAnalysis = async (fastaId: string, sequenceAnalysisResult: any) => {
        const sequenceAnalysisId = await db.sequence_analyses.add({
            schema: sequenceAnalysisResult["analysis_schema"],
            chewbbaca_version: sequenceAnalysisResult["chewBACCA_version"],
            result: {
                allele_ids: sequenceAnalysisResult["allele_ids"],
                allele_hashes: sequenceAnalysisResult["allele_hashes"],
            },
        });
        await db.samples.add({
            fasta_id: fastaId,
            sequence_analysis_id: sequenceAnalysisId,
            undeterminable_gen_count: sequenceAnalysisResult["undeterminable_gen_count"],
            contig_count: sequenceAnalysisResult["contig_count"],
            first_contig_length: sequenceAnalysisResult["first_contig_length"],
        });
    };

    public getQualityParameters = (sequence: string) => {
        console.log(sequence);
        return { contig_count: 0, first_contig_length: 0 };
    };
}
