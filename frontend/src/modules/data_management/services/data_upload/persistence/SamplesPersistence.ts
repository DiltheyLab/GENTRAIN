import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";
import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";

export class SamplesPersistence extends PersistenceStrategy {
    protected sampleUploadState: DataManagementState;
    constructor() {
        super();
        this.sampleUploadState = useDataManagementStore.getState();
    }
    protected persist = async (data: { fastaId: string; sequence: string }[]) => {
        this.sampleUploadState.setIsUploading(true);
        // analyse sample depending on pathogen type to receive variants for distance calculations
        const sampleAnalysisStrategy = await PathogenStrategyManager.getSampleAnalysisStrategy();
        if (!sampleAnalysisStrategy) return;
        sampleAnalysisStrategy.setSampleData(data);
        await sampleAnalysisStrategy.execute();
    };
}
