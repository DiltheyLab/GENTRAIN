import { CoreState, useCoreStore } from "@/modules/core/stores/core";

export abstract class PersistenceStrategy {
    protected data = null;
    protected coreState: CoreState;

    constructor() {
        this.coreState = useCoreStore.getState();
    }

    protected abstract persist(data: Array<Array<string>> | { fastaId: string; sequence: string }[] | string[][]): void;

    public async execute(data: Array<Array<string>> | { fastaId: string; sequence: string }[] | string[][]) {
        this.persist(data);
    }
}
