import { SequenceAnalysisStrategy } from "@/modules/data_management/services/sequence_analysis/SequenceAnalysisStrategy";
import gentrainWebsocketInstance from "@/modules/core/adapters/GentrainWebsocket.ts";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export class BacterialSequenceAnalysis extends SequenceAnalysisStrategy {
    protected parallelAnalysesThreshold = 10;

    protected emitSequenceAnalysis = () => {
        const sequenceImports = useDataManagementStore.getState().sequenceImports;
        const fastaHashesToProcess = this.getFastaHashesToProcess(sequenceImports);
        for (const fastaHash of fastaHashesToProcess) {
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
