import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
export class ViralSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 100;

    protected emitSequenceAnalysis = () => {
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        const finishedSequenceAnalyses = Object.keys(sequenceImports).filter(
            (fastaHash) =>
                sequenceImports[fastaHash].status === "finished" || sequenceImports[fastaHash].status === "failed"
        );
        const pendingSequenceAnalyses = Object.keys(sequenceImports).filter(
            (fastaHash) =>
                sequenceImports[fastaHash].status !== "finished" && sequenceImports[fastaHash].status !== "failed"
        );

        // use total amount of sequences to analyse or the amount of finished analyses for socket message limit
        // depending on which value is lower
        const socketMessageLimit = Math.min(
            finishedSequenceAnalyses.length + this.parallelAnalysesThreshold,
            pendingSequenceAnalyses.length
        );
        // always send max. 10 message via websockt channel to regulate user inputs
        let fastaString = "";
        for (let i = finishedSequenceAnalyses.length; i < socketMessageLimit; i++) {
            const fastaHash = Object.keys(sequenceImports)[i];
            if (sequenceImports[fastaHash].status === "finished" || sequenceImports[fastaHash].status === "failed")
                continue;
            fastaString += `>${fastaHash}\n${sequenceImports[fastaHash].sequence}\n`;
        }
        gentrainWebsocketInstance.sequenceAnalysisEmit(this.pathogen.id, fastaString);
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
