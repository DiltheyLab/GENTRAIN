export abstract class ValidationStrategy {
    protected header?: string[];
    protected data: string[][] | { [key: string]: string }[] | { fastaId: string; sequence: string }[] = [];
    protected columnNames: string[] = [];

    protected abstract validate(): Promise<{
        data: string[][] | {[key: string]: string}[] | { fastaId: string; sequence: string }[];
        warnings?: { title: string; description: string }[];
    }>;

    public abstract collectData(data: string[][] | { columns: string[], rows: { [key: string]: string }[] } | {
        fastaId: string;
        sequence: string
    }[]): void;

    public async execute(): Promise<{
        data: string[][] | {[key: string]: string}[] | { fastaId: string; sequence: string }[];
        warnings?: { title: string; description: string }[];
    }> {
        return this.validate();
    }

    protected isHeaderValid = () => {
        if (!this.header) return false;
        const requiredColumns = this.header.slice(0, this.columnNames.length);
        return (
            requiredColumns.length === this.columnNames.length &&
            requiredColumns.every((value, index) => value === this.columnNames[index])
        );
    };
}
