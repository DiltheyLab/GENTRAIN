import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import { SingleFileReading } from "@/modules/data_management/services/data_import/file_reading/SingleFileReading";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { activatePathogenType } from "@/modules/core/tests/lib";

describe("SingleFileReading", () => {
    let singleFileReadingStrategy: any;

    beforeEach(() => {
        singleFileReadingStrategy = new SingleFileReading();
    });

    describe("getAcceptedMimeType", () => {
        it("should return fasta mime type for sequence imports", () => {
            expect(singleFileReadingStrategy.getAcceptedMimeType("sequence")).toEqual([
                ".fa",
                ".mpfa",
                ".fna",
                ".fsa",
                ".fasta",
                ".zip",
            ]);
        });

        it("should return csv mime type for case imports", () => {
            expect(singleFileReadingStrategy.getAcceptedMimeType("case")).toEqual([".csv"]);
        });

        it("should return csv mime type for contact imports", () => {
            expect(singleFileReadingStrategy.getAcceptedMimeType("contact")).toEqual([".csv"]);
        });

        it("should return csv mime type for other import types", () => {
            expect(singleFileReadingStrategy.getAcceptedMimeType(":type:")).toEqual([".csv"]);
        });
    });

    describe("allowMultifile", () => {
        it("should not allow multiple file selection", () => {
            expect(singleFileReadingStrategy.allowMultifile()).toBeFalsy();
        });
    });

    describe("readContent", () => {
        it("should read content of a single text file correctly", async () => {
            const fileBuffer1 = fs.readFileSync(`${__dirname}/../../../../fixtures/files/test1.txt`);
            singleFileReadingStrategy.files = [new File([new Blob([fileBuffer1])], ":file_name_1:")];
            await singleFileReadingStrategy.readContent();

            expect(singleFileReadingStrategy.content).toEqual("test1");
        });
    });

    describe("collectFileObject", () => {
        it("should read content of a csv fasta file correctly", async () => {
            singleFileReadingStrategy.files = [
                new File([new Blob([":file_content:"])], ":file_name:.csv", { type: "text/csv" }),
            ];
            singleFileReadingStrategy.content = ":file_content:";
            const result = singleFileReadingStrategy.collectFileObject();
            expect(result).toEqual({ ":file_name:.csv": ":file_content:", mimetype: "csv" });
        });

        it("should read content of a single fasta file correctly", async () => {
            // file upload does not set mimetype for fasta files
            singleFileReadingStrategy.files = [new File([new Blob([":file_content:"])], ":file_name:.fasta")];
            singleFileReadingStrategy.content = ":file_content:";
            const result = singleFileReadingStrategy.collectFileObject();
            expect(result).toEqual({ ":file_name:.fasta": ":file_content:", mimetype: "fasta" });
        });

        it("should return undefined with empty content", async () => {
            singleFileReadingStrategy.files = [
                new File([new Blob([":file_content:"])], ":file_name:.csv", { type: "text/csv" }),
            ];
            const result = singleFileReadingStrategy.collectFileObject();
            expect(result).toBeUndefined();
        });
    });
    describe("execute", () => {
        it("should return csv file list", async () => {
            activatePathogenType(PathogenTypeName.viral);
            const files = [new File([new Blob(["test"])], ":file_name_1:.csv", { type: "text/csv" })];
            const result = await singleFileReadingStrategy.execute(files, "case");
            expect(result).toEqual({ ":file_name_1:.csv": "test", mimetype: "csv" });
        });

        it("should return fasta file list", async () => {
            activatePathogenType(PathogenTypeName.viral);
            const files = [new File([new Blob(["test"])], ":file_name_1:.fasta")];
            const result = await singleFileReadingStrategy.execute(files, "sequence");
            expect(result).toEqual({ ":file_name_1:.fasta": "test", mimetype: "fasta" });
        });

        it("should return null with missing files parameter", async () => {
            const result = await singleFileReadingStrategy.execute(null, "case");
            expect(result).toBeUndefined();
        });
    });
});
