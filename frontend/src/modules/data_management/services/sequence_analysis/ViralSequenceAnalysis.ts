import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
export class ViralSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 100;

    protected emitSequenceAnalysis = () => {
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        const fastaHashesToProcess = this.getFastaHashesToProcess(sequenceImports);
        // always send max. 10 message via websockt channel to regulate user inputs
        let fastaString = "";
        for (const fastaHash of fastaHashesToProcess) {
            if (sequenceImports[fastaHash].status === "success" || sequenceImports[fastaHash].status === "error")
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
