export abstract class ValidationStrategy {
    protected header?: string[];
    protected data: string[][] | { [key: string]: string }[] | { fastaId: string; sequence: string }[] = [];
    protected columnNames: string[] = [];

    protected abstract validate(): Promise<{
        data: string[][] | { [key: string]: string }[] | { fastaId: string; sequence: string }[];
        warnings?: { title: string; description: string }[];
    }>;

    public abstract collectData(data: string[][] | { columns: string[], rows: { [key: string]: string }[] } | {
        fastaId: string;
        sequence: string
    }[]): void;

    public async execute(): Promise<{
        data: string[][] | { [key: string]: string }[] | { fastaId: string; sequence: string }[];
        warnings?: { title: string; description: string }[];
    }> {
        return this.validate();
    }

    protected isHeaderValid = (columnDefinitions: {
        [columnName: string]: { required: boolean, names: string[] }
    }) => {
        if (!this.header) return false;
        const requiredColumns = Object.keys(columnDefinitions).filter((columnName) => columnDefinitions[columnName].required)
        const columnsFound = requiredColumns.map((requiredColumn) => {
            let found = false;
            for (const requiredColumnName of columnDefinitions[requiredColumn].names) {
                found = this.header!.includes(requiredColumnName);
                if (found) break;
            }
            return found;
        })
        return columnsFound.every((value) => value);
    };
}
