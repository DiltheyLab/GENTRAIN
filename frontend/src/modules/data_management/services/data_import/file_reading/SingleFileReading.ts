import {extractFileExtension, readFileAsText} from "@/modules/core/helpers/files";
import { FileReadingStrategy } from "./FileReadingStrategy";

export class SingleFileReading extends FileReadingStrategy {
    protected content: string | null = null;

    protected async readContent() {
        this.content = await readFileAsText(this.files[0]);
    }

    public allowMultifile() {
        return false;
    }

    protected collectFileObject(): { [filename: string]: string; mimetype: string } | undefined {
        if (!this.content) return;
        return { [this.files[0].name]: this.content, mimetype: extractFileExtension(this.files[0]) };
    }
}
