import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";
import { SequenceImport } from "@/modules/core/models/sequence_analyses";

export class BacterialSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 10;

    public setSequenceImports(sequenceImports: { [sequenceHash: string]: SequenceImport }) {
        for (let sequenceHash in sequenceImports) {
            sequenceImports[sequenceHash].sequence = this.getAnonymizedSequence(sequenceImports[sequenceHash].sequence);
        }
        this.sequenceImports = sequenceImports;
    }

    private getAnonymizedSequence = (sequence: string) => {
        return sequence.replace("\r", "").replace(/>(.*?)\n/g, ">\n");
    };

    protected emitSequenceAnalysis = () => {
        // use total amount of sequences to analyse or the amount of finished analyses for socket message limit
        // depending on which value is lower
        const socketMessageLimit = Math.min(
            this.finishedFastaIds.length + this.parallelAnalysesThreshold,
            Object.keys(this.fastaIdsToAnalyse).length
        );
        // always send max. 10 message via websocket channel to regulate user inputs
        for (let i = this.finishedFastaIds.length; i < socketMessageLimit; i++) {
            const fastaIdToAnalyse = this.fastaIdsToAnalyse[Object.keys(this.fastaIdsToAnalyse)[i]];
            gentrainWebsocketInstance.bacterialSequenceAnalysisEmit(
                this.pathogen.id,
                Object.keys(this.fastaIdsToAnalyse)[i],
                this.sampleData[fastaIdToAnalyse].imported.sequence
            );
        }
    };

    public getQualityParameters = (sequence: string) => {
        const contigs = sequence
            .replace("\r", "")
            .replace(/>(.*?)\n/g, ">\n")
            .replace("\n", "")
            .split(">");
        contigs.shift();
        return { contig_count: contigs.length, first_contig_length: contigs[0].length };
    };
}
