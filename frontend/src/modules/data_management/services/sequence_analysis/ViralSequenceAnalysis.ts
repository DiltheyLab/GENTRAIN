import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";
import { SequenceImport } from "@/modules/core/models/sequence_analyses";
export class ViralSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 100;

    public setSequenceImports(sequenceImports: { [fastaHash: string]: SequenceImport }) {
        this.sequenceImports = sequenceImports;
    }

    protected emitSequenceAnalysis = () => {
        const finishedSequenceAnalyses = Object.keys(this.sequenceImports).filter(
            (fastaHash) =>
                this.sequenceImports[fastaHash].status === "success" ||
                this.sequenceImports[fastaHash].status === "error"
        );
        const pendingSequenceAnalyses = Object.keys(this.sequenceImports).filter(
            (fastaHash) =>
                this.sequenceImports[fastaHash].status !== "success" &&
                this.sequenceImports[fastaHash].status !== "error"
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
            const sequenceHash = Object.keys(this.sequenceImports)[i];
            fastaString += `>${sequenceHash}\n${this.sequenceImports[sequenceHash].sequence}\n`;
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
