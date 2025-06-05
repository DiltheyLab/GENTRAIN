import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export class BacterialSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 10;

    protected emitSequenceAnalysis = () => {
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        const finishedSequenceAnalyses = Object.keys(sequenceImports).filter(
            (fastaHash) =>
                sequenceImports[fastaHash].status === "success" || sequenceImports[fastaHash].status === "error"
        );
        const pendingSequenceAnalyses = Object.keys(sequenceImports).filter(
            (fastaHash) =>
                sequenceImports[fastaHash].status !== "success" && sequenceImports[fastaHash].status !== "error"
        );

        // use total amount of sequences to analyse or the amount of finished analyses for socket message limit
        // depending on which value is lower
        const socketMessageLimit = Math.min(
            finishedSequenceAnalyses.length + this.parallelAnalysesThreshold,
            pendingSequenceAnalyses.length
        );
        // always send max. 10 message via websockt channel to regulate user inputs
        for (let i = finishedSequenceAnalyses.length; i < socketMessageLimit; i++) {
            const fastaHash = Object.keys(sequenceImports)[i];
            gentrainWebsocketInstance.sequenceAnalysisEmit(
                this.pathogen.id,
                this.getAnonymizedSequence(sequenceImports[fastaHash].sequence),
                fastaHash
            );
        }
    };

    private getAnonymizedSequence = (sequence: string) => {
        return sequence.replace("\r", "").replace(/>(.*?)\n/g, ">\n");
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
