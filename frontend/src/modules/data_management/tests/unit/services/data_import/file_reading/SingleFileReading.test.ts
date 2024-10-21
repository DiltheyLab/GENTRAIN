import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import { SingleFileReading } from "@/modules/data_management/services/data_import/file_reading/SingleFileReading";

describe("SingleFileReading", () => {
    let singleFileReadingStrategy: any;

    beforeEach(() => {
        singleFileReadingStrategy = Object.getPrototypeOf(new SingleFileReading());
    });

    it("should return fasta mime type for sequence imports", () => {
        expect(singleFileReadingStrategy.getAcceptedMimeType("sequence")).toEqual(".fasta");
    });
    it("should return csv mime type for case imports", () => {
        expect(singleFileReadingStrategy.getAcceptedMimeType("case")).toEqual(".csv");
    });
    it("should return csv mime type for contact imports", () => {
        expect(singleFileReadingStrategy.getAcceptedMimeType("contact")).toEqual(".csv");
    });
    it("should return csv mime type for other import types", () => {
        expect(singleFileReadingStrategy.getAcceptedMimeType(":type:")).toEqual(".csv");
    });

    it("should not allow multiple file selection", () => {
        expect(singleFileReadingStrategy.allowMultifile()).toBeFalsy();
    });
    it("should read content of a single text file correctly", async () => {
        let fileBuffer1 = fs.readFileSync(`${__dirname}/../../../../fixtures/files/test1.txt`);
        const files = mockFileList([new File([new Blob([fileBuffer1])], ":file_name_1:")]);
        await singleFileReadingStrategy.readContent(files);

        expect(singleFileReadingStrategy.content).toEqual("test1");
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
