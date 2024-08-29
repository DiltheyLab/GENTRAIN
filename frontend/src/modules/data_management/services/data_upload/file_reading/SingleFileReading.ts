import { readFileAsText } from "@/modules/core/helpers/files";
import { FileReadingStrategy } from "./FileReadingStrategy";

export class SingleFileReading extends FileReadingStrategy {
    protected content: string | null = null;

    protected async readContent(files: FileList) {
        this.content = await readFileAsText(files[0]);
    }

    public allowMultifile() {
        return false;
    }

    protected collectFileObject(files: FileList): { [filename: string]: string; mimetype: string } | undefined {
        if (!this.content) return;
        return { [files[0].name]: this.content, mimetype: files[0].type.includes("csv") ? "csv" : "fasta" };
    }
}
