import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { PersistenceStrategy } from "./PersistenceStrategy";

export class SamplesPersistence extends PersistenceStrategy {
    protected dataManagementState: DataManagementState;
    constructor() {
        super();
        this.dataManagementState = useDataManagementStore.getState();
    }
    protected persist = async () => {
        const samples = useDataManagementStore.getState().sampleImports;
        // analyse sample depending on pathogen type to receive variants for distance calculations
        this.dataManagementState.setSampleSelectionActive(false);
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
        if (!sequenceAnalysisStrategy) return;
        sequenceAnalysisStrategy.setSampleData(samples);
        sequenceAnalysisStrategy.execute();
    };

    protected update = async () => {};
}
