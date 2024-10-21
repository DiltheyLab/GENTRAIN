import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import { MultiFileReading } from "@/modules/data_management/services/data_import/file_reading/MultiFileReading";
import { mockFileList } from "@/modules/core/tests/mocks/files";

describe("MultiFileReading", () => {
    let multiFileReadingStrategy: any;

    beforeEach(() => {
        multiFileReadingStrategy = Object.getPrototypeOf(new MultiFileReading());
    });

    describe("getAcceptedMimeType", () => {
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
    });

    describe("allowMultifile", () => {
        it("should allow multiple file selection", () => {
            expect(multiFileReadingStrategy.allowMultifile()).toBeTruthy();
        });
    });

    describe("readContent", () => {
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

    describe("collectFileObject", () => {
        it("should read content of a csv file correctly", async () => {
            const files = mockFileList([
                new File([new Blob([":file_content_1:"])], ":file_name_1:", { type: "text/csv" }),
                new File([new Blob([":file_content_2:"])], ":file_name_2:", { type: "text/csv" }),
            ]);
            multiFileReadingStrategy.content = [":file_content_1:", ":file_content_2:"];
            const result = multiFileReadingStrategy.collectFileObject(files);
            expect(result).toEqual([
                { filename: ":file_name_1:", content: ":file_content_1:", mimetype: "csv" },
                { filename: ":file_name_2:", content: ":file_content_2:", mimetype: "csv" },
            ]);
        });
        it("should read content of a fasta file correctly", async () => {
            const files = mockFileList([
                new File([new Blob([":file_content_1:"])], ":file_name_1:"),
                new File([new Blob([":file_content_2:"])], ":file_name_2:"),
            ]);
            multiFileReadingStrategy.content = [":file_content_1:", ":file_content_2:"];
            const result = multiFileReadingStrategy.collectFileObject(files);
            expect(result).toEqual([
                { filename: ":file_name_1:", content: ":file_content_1:", mimetype: "fasta" },
                { filename: ":file_name_2:", content: ":file_content_2:", mimetype: "fasta" },
            ]);
        });
    });
});
