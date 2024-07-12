import { readFileAsText, readFilesAsText } from "@/services/files";

export const fileReadingStrategies = {
    singleFile: async (files: FileList | null) => {
        if (!files || files.length !== 1) throw new Error("No file or too many files selected");
        const text = await readFileAsText(files[0]);
        const result = { [files[0].name]: text };
        return result;
    },
    multiFile: async (files: FileList | null) => {
        if (!files) throw new Error("No files selected");
        const texts = await readFilesAsText(files);
        const result = texts.map((text, i) => ({ [files[i].name]: text }));
        return result;
    },
};
