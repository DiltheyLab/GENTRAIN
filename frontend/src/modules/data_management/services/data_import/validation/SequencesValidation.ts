import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { ValidationStrategy } from "./ValidationStrategy";
import { PathogenStrategyManager } from "../../pathogen_strategies/PathogenStrategyManager";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
import { SequenceImport } from "@/modules/core/models/sequence_analyses";
import { sha256 } from "js-sha256";

export class SequencesValidation extends ValidationStrategy {
    protected data: { fastaId: string; sequence: string }[] = [];

    public collectData(data: { fastaId: string; sequence: string }[]) {
        this.data = data;
    }

    protected validate = async () => {
        const activePathogen = useCoreStore.getState().activePathogen;
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();

        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        const sequenceImports: { [fastaId: string]: SequenceImport } = {};
        for (const sequenceItem of this.data) {
            const sequenceHash = sha256(sequenceItem.sequence);
            sequenceImports[sequenceHash] = {
                ...{
                    fasta_id: sequenceItem.fastaId,
                    sequence: sequenceItem.sequence,
                    status: "sent",
                },
                ...sequenceAnalysisStrategy?.getQualityParameters(sequenceItem.sequence),
            };
        }

        useDataManagementStore.getState().setSequenceImports(sequenceImports);

        if (this.data.length > 0) {
            useDataManagementStore.getState().setSampleSelectionActive(true);
        }

        if (useDataManagementStore.getState().showImportAssistent) {
            useDataManagementStore.getState().nextImportAssistentStep();
        }

        return {
            data: this.data,
        };
    };
}
