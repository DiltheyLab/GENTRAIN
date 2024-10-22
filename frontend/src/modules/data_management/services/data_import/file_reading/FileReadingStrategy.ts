export abstract class FileReadingStrategy {
    protected files: FileList | null = null;
    protected content: string | string[] | null = null;

    protected abstract readContent(files: FileList): Promise<void>;
    protected abstract collectFileObject(files: FileList): any;
    public abstract allowMultifile(): boolean;

    public async execute(files: FileList | null) {
        if (!files) return;
        await this.readContent(files);
        return this.collectFileObject(files);
    }

    public getAcceptedMimeType(importType: string) {
        switch (importType) {
            case "sequence":
                return ".fasta";
            default:
                return ".csv";
        }
    }
}
