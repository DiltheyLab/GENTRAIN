import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import { SingleFileReading } from "@/modules/data_management/services/data_import/file_reading/SingleFileReading";
import { mockFileList } from "@/modules/core/tests/mocks/files";

describe("SingleFileReading", () => {
    let singleFileReadingStrategy: any;

    beforeEach(() => {
        singleFileReadingStrategy = new SingleFileReading();
    });

    describe("getAcceptedMimeType", () => {
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
    });

    describe("allowMultifile", () => {
        it("should not allow multiple file selection", () => {
            expect(singleFileReadingStrategy.allowMultifile()).toBeFalsy();
        });
    });

    describe("readContent", () => {
        it("should read content of a single text file correctly", async () => {
            let fileBuffer1 = fs.readFileSync(`${__dirname}/../../../../fixtures/files/test1.txt`);
            const files = mockFileList([new File([new Blob([fileBuffer1])], ":file_name_1:")]);
            await singleFileReadingStrategy.readContent(files);

            expect(singleFileReadingStrategy.content).toEqual("test1");
        });
    });

    describe("collectFileObject", () => {
        it("should read content of a csv fasta file correctly", async () => {
            const files = mockFileList([new File([new Blob([":file_content:"])], ":file_name:", { type: "text/csv" })]);
            singleFileReadingStrategy.content = ":file_content:";
            const result = singleFileReadingStrategy.collectFileObject(files);
            expect(result).toEqual({ ":file_name:": ":file_content:", mimetype: "csv" });
        });

        it("should read content of a single fasta file correctly", async () => {
            // file upload does not set mimetype for fasta files
            const files = mockFileList([new File([new Blob([":file_content:"])], ":file_name:")]);
            singleFileReadingStrategy.content = ":file_content:";
            const result = singleFileReadingStrategy.collectFileObject(files);
            expect(result).toEqual({ ":file_name:": ":file_content:", mimetype: "fasta" });
        });

        it("should return undefined with empty content", async () => {
            const files = mockFileList([new File([new Blob([":file_content:"])], ":file_name:", { type: "text/csv" })]);
            const result = singleFileReadingStrategy.collectFileObject(files);
            expect(result).toBeUndefined();
        });
    });
    describe("execute", () => {
        it("should return csv file list", async () => {
            const files = mockFileList([new File([new Blob(["test"])], ":file_name_1:", { type: "text/csv" })]);
            const result = await singleFileReadingStrategy.execute(files);
            expect(result).toEqual({ ":file_name_1:": "test", mimetype: "csv" });
        });

        it("should return fasta file list", async () => {
            const files = mockFileList([new File([new Blob(["test"])], ":file_name_1:")]);
            const result = await singleFileReadingStrategy.execute(files);
            expect(result).toEqual({ ":file_name_1:": "test", mimetype: "fasta" });
        });

        it("should return null with missing files parameter", async () => {
            const result = await singleFileReadingStrategy.execute(null);
            expect(result).toBeUndefined();
        });
    });
});
