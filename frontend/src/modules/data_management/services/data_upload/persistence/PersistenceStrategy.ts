import { CoreState, useCoreStore } from "@/modules/core/stores/core";

export abstract class PersistenceStrategy {
    protected data = null;
    protected coreState: CoreState;

    constructor() {
        this.coreState = useCoreStore.getState();
    }

    protected abstract persist(): Promise<void>;

    public async execute() {
        await this.persist();
        await this.synchronizeWithStore();
    }

    private async synchronizeWithStore() {
        await this.coreState.updateCasesWithRelationships();
    }
}
