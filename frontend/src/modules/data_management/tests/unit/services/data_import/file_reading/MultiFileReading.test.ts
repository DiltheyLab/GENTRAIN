import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import { MultiFileReading } from "@/modules/data_management/services/data_import/file_reading/MultiFileReading";

describe("MultiFileReading", () => {
    let multiFileReadingStrategy: any;

    beforeEach(() => {
        multiFileReadingStrategy = Object.getPrototypeOf(new MultiFileReading());
    });

    it("should return fasta mime type for sequence imports", () => {
        expect(multiFileReadingStrategy.getAcceptedMimeType("sequence")).toEqual(".fasta");
    });

    it("should return csv mime type for case imports", () => {
        expect(multiFileReadingStrategy.getAcceptedMimeType("case")).toEqual(".csv");
    });

    it("should return csv mime type for contact imports", () => {
        expect(multiFileReadingStrategy.getAcceptedMimeType("contact")).toEqual(".csv");
    });

    it("should return csv mime type for other import types", () => {
        expect(multiFileReadingStrategy.getAcceptedMimeType(":type:")).toEqual(".csv");
    });

    it("should allow multiple file selection", () => {
        expect(multiFileReadingStrategy.allowMultifile()).toBeTruthy();
    });

    it("should read content of multiple text files correctly", async () => {
        let fileBuffer1 = fs.readFileSync(`${__dirname}/../../../../fixtures/files/test1.txt`);
        let fileBuffer2 = fs.readFileSync(`${__dirname}/../../../../fixtures/files/test2.txt`);
        const files = mockFileList([
            new File([new Blob([fileBuffer1])], ":file_name_1:"),
            new File([new Blob([fileBuffer2])], ":file_name_2:"),
        ]);
        await multiFileReadingStrategy.readContent(files);

        expect(multiFileReadingStrategy.content).toContain("test1");
        expect(multiFileReadingStrategy.content).toContain("test2");
    });
});

const mockFileList = (files: File[]) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("name", "file-upload");
    input.multiple = true;
    const mockFileList = Object.create(input.files);
    for (const index in files) {
        mockFileList[index] = files[index];
    }
    Object.defineProperty(mockFileList, "length", { value: files.length });
    return mockFileList;
};
