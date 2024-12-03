import { useCoreStore } from "@/modules/core/stores/core";

export abstract class PersistenceStrategy {
    protected data = null;

    protected abstract persist(): Promise<void>;

    public async execute() {
        try {
            await this.persist();
            await this.synchronizeWithStore();
        } catch (error) {
            throw error;
        }
    }

    private async synchronizeWithStore() {
        await useCoreStore.getState().updateCasesWithRelationships();
    }
}
