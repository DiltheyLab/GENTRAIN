import { readFileAsText, readFilesAsText } from "@/modules/core/helpers/files";

export const fileReadingStrategies = {
    singleFile: async (files: FileList | null) => {
        if (!files || files.length !== 1) throw new Error("No file or too many files selected");
        const text = await readFileAsText(files[0]);
        const result = { [files[0].name]: text, mimetype: files[0].type.includes("csv") ? "csv" : "fasta" };

        return result;
    },
    multiFile: async (files: FileList | null) => {
        if (!files) throw new Error("No files selected");
        const texts = await readFilesAsText(files);
        const result = texts.map((text, i) => ({
            filename: files[i].name,
            content: text,
            mimetype: files[i].type.includes("csv") ? "csv" : "fasta",
        }));

        return result;
    },
};
