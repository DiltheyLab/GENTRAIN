import { extractFileExtension, extractZip, readFilesAsText } from "@/modules/core/helpers/files";
import { FileReadingStrategy } from "./FileReadingStrategy";

export class MultiFileReading extends FileReadingStrategy {
    protected content: string[] | null = null;

    public async readContent() {
        const extractedZipFiles = await Promise.all(
            this.files
                .filter((file) => file.type === "application/zip")
                .map(async (file): Promise<File[]> => {
                    const files = await extractZip(file);
                    return files;
                })
        );
        const nonZipFiles = this.files.filter((file) => file.type !== "application/zip");
        this.files = nonZipFiles.concat(...extractedZipFiles);
        this.content = await readFilesAsText(this.files);
    }

    public allowMultifile() {
        return true;
    }

    protected collectFileObject(): ({ filename: string; content: string; mimetype: string } | undefined)[] | undefined {
        if (!this.content) {
            return;
        }
        return this.content?.map((text, i) => {
            const extension = extractFileExtension(this.files[i]);
            return {
                filename: this.files[i].name,
                content: text,
                mimetype: extension,
            };
        });
    }
}
