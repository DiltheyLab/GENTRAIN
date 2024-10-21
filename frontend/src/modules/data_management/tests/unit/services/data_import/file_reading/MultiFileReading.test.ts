import { describe, it, expect, beforeEach } from "vitest";
import { MultiFileReading } from "@/modules/data_management/services/data_import/file_reading/MultiFileReading";
import { mockFileList } from "@/modules/core/tests/mocks/files";

describe("MultiFileReading", () => {
    let multiFileReadingStrategy: any;

    beforeEach(() => {
        multiFileReadingStrategy = new MultiFileReading();
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
            const files = mockFileList([
                new File([new Blob(["test1"])], ":file_name_1:"),
                new File([new Blob(["test2"])], ":file_name_2:"),
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

        it("should return undefined with empty content", async () => {
            const files = mockFileList([
                new File([new Blob([":file_content_1:"])], ":file_name_1:"),
                new File([new Blob([":file_content_2:"])], ":file_name_2:"),
            ]);

            const result = multiFileReadingStrategy.collectFileObject(files);
            expect(result).toBeUndefined();
        });
    });

    describe("execute", () => {
        it("should return csv file list", async () => {
            const files = mockFileList([
                new File([new Blob(["test1"])], ":file_name_1:", { type: "text/csv" }),
                new File([new Blob(["test2"])], ":file_name_2:", { type: "text/csv" }),
            ]);
            const result = await multiFileReadingStrategy.execute(files);
            expect(result).toEqual([
                { filename: ":file_name_1:", content: "test1", mimetype: "csv" },
                { filename: ":file_name_2:", content: "test2", mimetype: "csv" },
            ]);
        });

        it("should return fasta file list", async () => {
            const files = mockFileList([
                new File([new Blob(["test1"])], ":file_name_1:"),
                new File([new Blob(["test2"])], ":file_name_2:"),
            ]);
            const result = await multiFileReadingStrategy.execute(files);
            expect(result).toEqual([
                { filename: ":file_name_1:", content: "test1", mimetype: "fasta" },
                { filename: ":file_name_2:", content: "test2", mimetype: "fasta" },
            ]);
        });

        it("should return file list with different mimetypes", async () => {
            const files = mockFileList([
                new File([new Blob(["test1"])], ":file_name_1:", { type: "text/csv" }),
                new File([new Blob(["test2"])], ":file_name_2:"),
            ]);
            const result = await multiFileReadingStrategy.execute(files);
            expect(result).toEqual([
                { filename: ":file_name_1:", content: "test1", mimetype: "csv" },
                { filename: ":file_name_2:", content: "test2", mimetype: "fasta" },
            ]);
        });

        it("should return null with missing files parameter", async () => {
            const result = await multiFileReadingStrategy.execute(null);
            expect(result).toBeUndefined();
        });
    });
});
