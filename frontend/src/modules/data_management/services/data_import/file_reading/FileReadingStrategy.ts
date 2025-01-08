import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";

export abstract class FileReadingStrategy {
    protected files: FileList | null = null;
    protected content: string | string[] | null = null;

    protected abstract readContent(files: FileList): Promise<void>;
    protected abstract collectFileObject(files: FileList): any;
    public abstract allowMultifile(): boolean;

    public async execute(files: FileList | null, importType: string) {
        if (!files) return;
        this.checkAcceptedMimeTypes(files, importType);
        await this.readContent(files);
        return this.collectFileObject(files);
    }

    private checkAcceptedMimeTypes(files: FileList, importType: string) {
        Array.from(files).map((file: File) => {
            const extension = file.name.substring(file.name.indexOf("."), file.name.length);
            if (!this.getAcceptedMimeType(importType).includes(extension)) {
                throw new GentrainException("InvalidMimeTypeError", [this.getAcceptedMimeType(importType).join(", ")]);
            }
        });
    }

    public getAcceptedMimeType(importType: string) {
        const activePathogen = useCoreStore.getState().activePathogen;
        switch (importType) {
            case "sequence":
                return activePathogen?.pathogen_type?.name === PathogenTypeName.viral
                    ? [".fasta", ".fn", ".fa"]
                    : [".fasta", ".fn", ".fa", ".zip"];
            default:
                return [".csv"];
        }
    }
}
