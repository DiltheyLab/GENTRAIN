import { DataManagementStore, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { PersistenceStrategy } from "./PersistenceStrategy";

export class SamplesPersistence extends PersistenceStrategy {
    protected dataManagementStore: DataManagementStore;
    constructor() {
        super();
        this.dataManagementStore = useDataManagementStore.getState();
    }
    protected persist = async () => {
        try {
            const samples = useDataManagementStore.getState().sampleImports;
            // analyse sample depending on pathogen type to receive variants for distance calculations
            this.dataManagementStore.setSampleSelectionActive(false);
            const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
            if (!sequenceAnalysisStrategy) return;
            sequenceAnalysisStrategy.setSampleData(samples);
            sequenceAnalysisStrategy.execute();
        } catch (error) {
            console.error(error);
        }
    };
}
