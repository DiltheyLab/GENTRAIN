import { describe, it, expect, beforeEach } from "vitest";
import { MultiFileReading } from "@/modules/data_management/services/data_import/file_reading/MultiFileReading";
import { mockFileList } from "@/modules/core/tests/mocks/files";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { activatePathogenType } from "@/modules/core/tests/lib";

describe("MultiFileReading", () => {
    let multiFileReadingStrategy: any;

    beforeEach(() => {
        multiFileReadingStrategy = new MultiFileReading();
    });

    describe("getAcceptedMimeType", () => {
        it("should return fasta mime type for sequence imports", () => {
            expect(multiFileReadingStrategy.getAcceptedMimeType("sequence")).toEqual([
                ".fa",
                ".mpfa",
                ".fna",
                ".fsa",
                ".fasta",
                ".zip",
            ]);
        });

        it("should return csv mime type for case imports", () => {
            expect(multiFileReadingStrategy.getAcceptedMimeType("case")).toEqual([".csv"]);
        });

        it("should return csv mime type for contact imports", () => {
            expect(multiFileReadingStrategy.getAcceptedMimeType("contact")).toEqual([".csv"]);
        });

        it("should return csv mime type for other import types", () => {
            expect(multiFileReadingStrategy.getAcceptedMimeType(":type:")).toEqual([".csv"]);
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
                new File([new Blob(["test1"])], ":file_name_1:.csv"),
                new File([new Blob(["test2"])], ":file_name_2:.csv"),
            ]);
            await multiFileReadingStrategy.readContent(files);

            expect(multiFileReadingStrategy.content).toContain("test1");
            expect(multiFileReadingStrategy.content).toContain("test2");
        });
    });

    describe("collectFileObject", () => {
        it("should read content of a csv file correctly", async () => {
            const files = mockFileList([
                new File([new Blob([":file_content_1:"])], ":file_name_1:.csv", { type: "text/csv" }),
                new File([new Blob([":file_content_2:"])], ":file_name_2:.csv", { type: "text/csv" }),
            ]);
            multiFileReadingStrategy.content = [":file_content_1:", ":file_content_2:"];
            const result = multiFileReadingStrategy.collectFileObject(files);
            expect(result).toEqual([
                { filename: ":file_name_1:.csv", content: ":file_content_1:", mimetype: "csv" },
                { filename: ":file_name_2:.csv", content: ":file_content_2:", mimetype: "csv" },
            ]);
        });
        it("should read content of a fasta file correctly", async () => {
            const files = mockFileList([
                new File([new Blob([":file_content_1:"])], ":file_name_1:.fasta"),
                new File([new Blob([":file_content_2:"])], ":file_name_2:.fasta"),
            ]);
            multiFileReadingStrategy.content = [":file_content_1:", ":file_content_2:"];
            const result = multiFileReadingStrategy.collectFileObject(files);
            expect(result).toEqual([
                { filename: ":file_name_1:.fasta", content: ":file_content_1:", mimetype: "fasta" },
                { filename: ":file_name_2:.fasta", content: ":file_content_2:", mimetype: "fasta" },
            ]);
        });

        it("should return undefined with empty content", async () => {
            const files = mockFileList([
                new File([new Blob([":file_content_1:"])], ":file_name_1:.csv"),
                new File([new Blob([":file_content_2:"])], ":file_name_2:.csv"),
            ]);

            const result = multiFileReadingStrategy.collectFileObject(files);
            expect(result).toBeUndefined();
        });
    });

    describe("execute", () => {
        it("should return csv file list", async () => {
            activatePathogenType(PathogenTypeName.viral);
            const files = mockFileList([
                new File([new Blob(["test1"])], ":file_name_1:.csv", { type: "text/csv" }),
                new File([new Blob(["test2"])], ":file_name_2:.csv", { type: "text/csv" }),
            ]);
            const result = await multiFileReadingStrategy.execute(files, "case");
            expect(result).toEqual([
                { filename: ":file_name_1:.csv", content: "test1", mimetype: "csv" },
                { filename: ":file_name_2:.csv", content: "test2", mimetype: "csv" },
            ]);
        });

        it("should return fasta file list", async () => {
            activatePathogenType(PathogenTypeName.viral);
            const files = mockFileList([
                new File([new Blob(["test1"])], ":file_name_1:.fasta"),
                new File([new Blob(["test2"])], ":file_name_2:.fasta"),
            ]);
            const result = await multiFileReadingStrategy.execute(files, "sequence");
            expect(result).toEqual([
                { filename: ":file_name_1:.fasta", content: "test1", mimetype: "fasta" },
                { filename: ":file_name_2:.fasta", content: "test2", mimetype: "fasta" },
            ]);
        });

        it("should return file list with different mimetypes", async () => {
            activatePathogenType(PathogenTypeName.bacterial);
            const files = mockFileList([
                new File([new Blob(["test1"])], ":file_name_1:.zip", { type: "application/zip" }),
                new File([new Blob(["test2"])], ":file_name_2:.fasta"),
            ]);
            const result = await multiFileReadingStrategy.execute(files, "sequence");
            expect(result).toEqual([
                { filename: ":file_name_1:.zip", content: "test1", mimetype: "zip" },
                { filename: ":file_name_2:.fasta", content: "test2", mimetype: "fasta" },
            ]);
        });

        it("should return null with missing files parameter", async () => {
            const result = await multiFileReadingStrategy.execute(null, "case");
            expect(result).toBeUndefined();
        });
    });
});
