import { CoreState, useCoreStore } from "@/modules/core/stores/core";
import { DataManagementState, useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export abstract class ValidationStrategy {
    protected coreState: CoreState;
    protected dataManagementState: DataManagementState;

    constructor() {
        this.coreState = useCoreStore.getState();
        this.dataManagementState = useDataManagementStore.getState();
    }

    protected abstract validate(
        data: Array<Array<string>> | { fastaId: string; sequence: string }[] | string[][]
    ): Promise<{
        data: string[][] | { fastaId: string; sequence: string }[];
        warnings?: { title: string; description: string }[];
    }>;

    public async execute(data: Array<Array<string>> | { fastaId: string; sequence: string }[] | string[][]): Promise<{
        data: string[][] | { fastaId: string; sequence: string }[];
        warnings?: { title: string; description: string }[];
    }> {
        return this.validate(data);
    }

    protected isHeaderValid = (header: string[], columnNames: string[]) => {
        return header.length === columnNames.length && header.every((value, index) => value === columnNames[index]);
    };
}
