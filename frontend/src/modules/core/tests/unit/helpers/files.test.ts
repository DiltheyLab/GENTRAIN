import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "fs";
import {
    collectFastaIdsAndSequences,
    downloadFile,
    formatData,
    readFileAsText,
    readFilesAsText,
} from "@/modules/core/helpers/files";

describe("FilesHelper", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("readFileAsText", () => {
        it("should read txt content as text", async () => {
            const fileBuffer1 = fs.readFileSync(`${__dirname}/../../fixtures/files/test1.txt`);
            const result = await readFileAsText(new File([new Blob([fileBuffer1])], ":file_name_1:"));

            expect(result).toEqual("test1");
        });

        it("should read csv content as text", async () => {
            const fileBuffer = fs.readFileSync(`${__dirname}/../../fixtures/files/test_cases.csv`);
            const file = new File([new Blob([fileBuffer])], ":file_name:");
            const result = await readFileAsText(file);

            expect(result).toBeTypeOf("string");
            expect(result.includes(":case_id_1:")).toBeTruthy();
            expect(result.includes(":case_id_2:")).toBeTruthy();
            expect(result.includes(":category_1_group_1:")).toBeTruthy();
            expect(result.includes(":fasta_id_1:")).toBeTruthy();
        });
    });

    describe("readFilesAsText", async () => {
        it("should read single file content as text", async () => {
            const fileBuffer1 = fs.readFileSync(`${__dirname}/../../fixtures/files/test1.txt`);
            const files = [new File([new Blob([fileBuffer1])], ":file_name_1:")];
            const result = await readFilesAsText(files);

            expect(result).toEqual(["test1"]);
        });
        it("should read multiple file content as text", async () => {
            const fileBuffer1 = fs.readFileSync(`${__dirname}/../../fixtures/files/test1.txt`);
            const fileBuffer2 = fs.readFileSync(`${__dirname}/../../fixtures/files/test2.txt`);
            const files = [new Blob([fileBuffer1]), new Blob([fileBuffer2])];
            const result = await readFilesAsText(files as File[]);

            expect(result).toEqual(["test1", "test2"]);
        });
    });

    describe("collectFastaIdsAndContent", async () => {
        it("should collect all fasta ids and sequences in array of strings", async () => {
            const sequences = [
                ">:fasta_id_1:\n:sequence_1:",
                ">:fasta_id_2:\n:sequence_2:",
                ">:fasta_id_3:\n:sequence_3:",
            ];
            const result = collectFastaIdsAndSequences(sequences);

            expect(result).toEqual([
                { fastaId: ":fasta_id_1:", sequence: ":sequence_1:" },
                { fastaId: ":fasta_id_2:", sequence: ":sequence_2:" },
                { fastaId: ":fasta_id_3:", sequence: ":sequence_3:" },
            ]);
        });
    });

    describe("formatData", async () => {
        it("should collect all fasta ids and sequences from fasta string", async () => {
            const result = formatData({
                ":file_name": ">:fasta_id_1:\n:sequence_1:\n>:fasta_id_2:\n:sequence_2:\n>:fasta_id_3:\n:sequence_3:",
                mimetype: "fasta",
            });

            expect(result).toEqual([
                { fastaId: ":fasta_id_1:", sequence: ":sequence_1:" },
                { fastaId: ":fasta_id_2:", sequence: ":sequence_2:" },
                { fastaId: ":fasta_id_3:", sequence: ":sequence_3:" },
            ]);
        });

        it("should collect all rows from csv string", async () => {
            const result = formatData({
                ":file_name:":
                    ":column_1:;:column_2:;:column_3:\n:column_1_row_1:;:column_2_row_1:;:column_3_row_1:\n:column_1_row_2:;:column_2_row_2:;:column_3_row_2:",
                mimetype: "csv",
            });

            expect(result).toEqual({
                columns: [":column_1:", ":column_2:", ":column_3:"],
                rows: [
                    {
                        ":column_1:": ":column_1_row_1:",
                        ":column_2:": ":column_2_row_1:",
                        ":column_3:": ":column_3_row_1:",
                    },
                    {
                        ":column_1:": ":column_1_row_2:",
                        ":column_2:": ":column_2_row_2:",
                        ":column_3:": ":column_3_row_2:",
                    },
                ],
            });
        });

        it("should collect all rows from multiple fasta string", async () => {
            const result = formatData([
                {
                    filename: ":fasta_id_1:",
                    content:
                        ">:fasta_id_1_contig_1:\n:fasta_id_1_sequence_1:\n>:fasta_id_1_contig_2:\n:fasta_id_1_sequence_2:\n>:fasta_id_1_contig_3:\n:fasta_id_1_sequence_3:",
                    mimetype: "fasta",
                },
                {
                    filename: ":fasta_id_2:",
                    content:
                        ">:fasta_id_2_contig_1:\n:fasta_id_2_sequence_1:\n>:fasta_id_2_contig_2:\n:fasta_id_2_sequence_2:",
                    mimetype: "fasta",
                },
            ]);

            expect(result).toEqual([
                {
                    fastaId: ":fasta_id_1:",
                    sequence:
                        ">:fasta_id_1_contig_1:\n:fasta_id_1_sequence_1:\n>:fasta_id_1_contig_2:\n:fasta_id_1_sequence_2:\n>:fasta_id_1_contig_3:\n:fasta_id_1_sequence_3:",
                },
                {
                    fastaId: ":fasta_id_2:",
                    sequence:
                        ">:fasta_id_2_contig_1:\n:fasta_id_2_sequence_1:\n>:fasta_id_2_contig_2:\n:fasta_id_2_sequence_2:",
                },
            ]);
        });
    });

    describe("downloadFile", async () => {
        it("should create an anchor element with correct file name and object url as parameters which is clicked once to download the file", async () => {
            const fileBuffer1 = fs.readFileSync(`${__dirname}/../../fixtures/files/test1.txt`);
            const blob = new Blob([fileBuffer1]);
            const link = document.createElement("a");
            window.URL.createObjectURL = vi.fn(() => ":object_url:");
            // mock methods that are not yet supported by jsdom
            const spyOnCreateElement = vi.spyOn(document, "createElement").mockImplementation(() => link);
            const spyOnLinkClick = vi.spyOn(link, "click").mockImplementation(() => {}); // Prevent actual navigation
            downloadFile(blob, ":file_name:");

            expect(spyOnCreateElement).toHaveBeenCalledOnce();
            expect(link.download).toBe(":file_name:");
            expect(link.href).toContain(":object_url:");
            expect(spyOnLinkClick).toHaveBeenCalledOnce();
        });
    });
});
