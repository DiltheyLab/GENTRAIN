import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";
import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";

export class SamplesPersistence extends PersistenceStrategy {
    protected dataManagementState: DataManagementState;
    constructor() {
        super();
        this.dataManagementState = useDataManagementStore.getState();
    }
    protected persist = async (data: { fastaId: string; sequence: string }[]) => {
        // analyse sample depending on pathogen type to receive variants for distance calculations
        this.dataManagementState.setSampleSelectionActive(false);
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
        if (!sequenceAnalysisStrategy) return;
        sequenceAnalysisStrategy.setSampleData(data);
        sequenceAnalysisStrategy.execute();
    };
}
