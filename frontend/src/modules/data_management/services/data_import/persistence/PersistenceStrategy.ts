import { useCoreStore } from "@/modules/core/stores/core";

export abstract class PersistenceStrategy {
    protected data = null;
    protected pathogen = useCoreStore.getState().activePathogen;

    protected abstract persist(): Promise<void>;

    public async execute() {
        await this.persist();
        await this.synchronizeWithStore();
    }

    private async synchronizeWithStore() {
        await useCoreStore.getState().updateCasesWithRelationships();
    }
}
