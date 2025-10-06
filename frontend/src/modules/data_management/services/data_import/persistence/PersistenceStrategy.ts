import { useCoreStore } from "@/modules/core/stores/core";
import { TTLHOURS } from "@/modules/data_management/components/data_deletion/DataDeletionOptions";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export abstract class PersistenceStrategy {
    protected data = null;
    protected pathogen = useCoreStore.getState().activePathogen;

    protected abstract persist(): Promise<void>;

    public async execute() {
        await this.persist();
        await this.synchronizeWithStore();
        this.setIndexedDbTtlOnDataImport();
    }

    private setIndexedDbTtlOnDataImport() {
        const indexedDbTtlIsEnabled = useDataManagementStore.getState().indexedDbTtlIsEnabled;
        const setIndexedDbExpiresAt = useDataManagementStore.getState().setIndexedDbExpiresAt;
        if (indexedDbTtlIsEnabled) {
            setIndexedDbExpiresAt(TTLHOURS);
        }
    }
    private async synchronizeWithStore() {
        await useCoreStore.getState().updateCasesWithRelationships();
    }
}
