import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { ValidationStrategy } from "./ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useCoreStore } from "@/modules/core/stores/core";
import { SequenceImport } from "@/modules/core/models/sequence_analyses";
import SequenceWorker from "./sequenceWorker?worker";

export class SequencesValidation extends ValidationStrategy {
    protected data: { fastaId: string; sequence: string }[] = [];

    public collectData(data: { fastaId: string; sequence: string }[]) {
        this.data = data;
    }

    protected validate = async () => {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        // run sequence validation in a web worker to prevent blocking the render loop
        // in case of large file sizes (especially relevant for bacterial imports)
        const worker = new SequenceWorker();
        const sequenceImports: {
            [fastaHash: string]: SequenceImport;
        } = await new Promise((resolve, reject) => {
            worker.onmessage = (e) => resolve(e.data);
            worker.onerror = reject;
            worker.postMessage({ sequences: this.data, activePathogen: activePathogen });
        });
        worker.terminate();

        useDataManagementStore.getState().setSequenceImports(sequenceImports);

        if (this.data.length > 0) {
            useDataManagementStore.getState().setSequenceSelectionActive(true);
        }

        if (useDataManagementStore.getState().showImportAssistent) {
            useDataManagementStore.getState().nextImportAssistentStep();
        }

        return {
            data: this.data,
        };
    };
}
