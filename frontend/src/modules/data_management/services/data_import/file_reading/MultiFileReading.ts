import { readFilesAsText } from "@/modules/core/helpers/files";
import { FileReadingStrategy } from "./FileReadingStrategy";

export class MultiFileReading extends FileReadingStrategy {
    protected content: string[] | null = null;

    public async readContent(files: FileList) {
        this.content = await readFilesAsText(files);
    }

    public allowMultifile() {
        return true;
    }

    protected collectFileObject(
        files: FileList
    ): ({ filename: string; content: string; mimetype: string } | undefined)[] | undefined {
        if (!this.content) return;
        return this.content?.map((text, i) => {
            return {
                filename: files[i].name,
                content: text,
                mimetype: files[i].type.includes("csv") ? "csv" : "fasta",
            };
        });
    }
}
