import {SampleImport, SampleSchema} from "@/modules/core/models/samples";
import {db} from "@/modules/core/services/database/DatabaseManager";
import {SequenceAnalysisStrategy} from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";

export class BacterialSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 10;
    public setSampleData = (sampleData: {
        [id: string]: { imported: SampleImport; persisted: SampleSchema | null; import: boolean };
    }) => {
        this.sampleData = sampleData;
        this.pseudonymiseAssemblies();
    };

    private pseudonymiseAssemblies = () => {
        for (const fastaId of Object.keys(this.sampleData)) {
            this.sampleData[fastaId].imported.sequence = this.sampleData[fastaId].imported.sequence
                .replace("\r", "")
                .replace(/>(.*?)\n/g, ">\n");
        }
    };

    protected emitSequenceAnalysis = () => {
        // use total amount of sequences to analyse or the amount of finished analyses for socket message limit
        // depending on which value is lower
        const socketMessageLimit = Math.min(
            this.finishedFastaIds.length + this.parallelAnalysesThreshold,
            Object.keys(this.fastaIdsToAnalyse).length
        );
        // always send max. 10 message via websockt channel to regulate user inputs
        for (let i = this.finishedFastaIds.length; i < socketMessageLimit; i++) {
            const fastaIdToAnalyse = this.fastaIdsToAnalyse[Object.keys(this.fastaIdsToAnalyse)[i]];
            gentrainWebsocketInstance.bacterialSequenceAnalysisEmit(
                this.pathogen.id,
                Object.keys(this.fastaIdsToAnalyse)[i],
                this.sampleData[fastaIdToAnalyse].imported.sequence
            );
        }
    }

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
        const contigs = sequence
            .replace("\r", "")
            .replace(/>(.*?)\n/g, ">\n")
            .replace("\n", "")
            .split(">");
        contigs.shift();
        return {contig_count: contigs.length, first_contig_length: contigs[0].length};
    };
}
