import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { extractFileExtension, FASTA_EXTENSIONS } from "@/modules/core/helpers/files";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";

export abstract class FileReadingStrategy {
    protected files: File[] = [];
    protected content: string | string[] | null = null;

    protected abstract readContent(): Promise<void>;
    protected abstract collectFileObject(): any;
    public abstract allowMultifile(): boolean;

    public async execute(files: FileList | null, importType: string) {
        if (!files) return;
        this.files = Array.from(files);
        this.checkAcceptedMimeTypes(importType);
        await this.readContent();
        return this.collectFileObject();
    }

    private checkAcceptedMimeTypes(importType: string) {
        if (!this.files) {
            return;
        }
        this.files.map((file: File) => {
            const extension = extractFileExtension(file);
            if (!this.getAcceptedMimeType(importType).includes(`.${extension}`)) {
                throw new GentrainException("InvalidMimeTypeError", [this.getAcceptedMimeType(importType).join(", ")]);
            }
        });
    }

    public getAcceptedMimeType(importType: string) {
        const activePathogen = useCoreStore.getState().activePathogen;
        switch (importType) {
            case "sequence":
                return activePathogen?.pathogen_type?.name === PathogenTypeName.viral
                    ? FASTA_EXTENSIONS
                    : FASTA_EXTENSIONS.concat([".zip"]);
            default:
                return [".csv"];
        }
    }

    public setFiles(files: File[]) {
        this.files = files;
    }
}
