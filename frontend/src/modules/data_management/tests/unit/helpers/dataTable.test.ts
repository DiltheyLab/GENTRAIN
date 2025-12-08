import { describe, it, expect, vi } from "vitest";
import {
    uploadedDataFilterFn,
    caseImportFilterFn,
    caseUpdateFilterFn,
    sequenceImportFilterFn,
    contactImportFilterFn,
} from "@/modules/data_management/helpers/dataTable";
import { CaseWithRelationships, CaseImport } from "@/modules/core/models/cases";
import { ContactImport } from "@/modules/core/models/contacts";
import { ViralAnalysisResult } from "@/modules/core/models/sequence_analyses";

// Mock the formatDate function
vi.mock("@/modules/core/helpers/dates", () => ({
    formatDate: (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return (day < 10 ? `0${day}` : day) + "." + (month < 10 ? `0${month}` : month) + "." + date.getFullYear();
    },
}));

describe("dataTable filters", () => {
    describe("uploadedDataFilterFn", () => {
        const createMockCase = (overrides: Partial<CaseWithRelationships> = {}): CaseWithRelationships => ({
            id: 1,
            case_id: "CASE001",
            fasta_id: "FASTA001",
            pathogen_id: 1,
            outbreak_id: 1,
            group_ids: [1, 2],
            street: null,
            zip_code: null,
            city: null,
            first_name: null,
            last_name: null,
            infected_by: null,
            registered_at: new Date(2025, 0, 15),
            ...overrides,
        });

        it("should filter by case_id", () => {
            const row = { original: createMockCase({ case_id: "CASE123" }) };
            expect(uploadedDataFilterFn(row, "any", "case123", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "CASE123", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "case999", undefined)).toBe(false);
        });

        it("should filter by fasta_id", () => {
            const row = { original: createMockCase({ fasta_id: "FASTA456" }) };
            expect(uploadedDataFilterFn(row, "any", "fasta456", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "FASTA", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "xyz", undefined)).toBe(false);
        });

        it("should return false when fasta_id is null", () => {
            const row = { original: createMockCase({ fasta_id: null }) };
            expect(uploadedDataFilterFn(row, "any", "fasta", undefined)).toBe(false);
        });

        it("should filter by lineage from viral analysis result", () => {
            const viralResult: ViralAnalysisResult = {
                substitutions: [],
                deletions: [],
                insertions: [],
                missing: [],
                nonACGTNs: [],
                alignmentRange: { begin: 0, end: 100 },
                sequence_length: 29000,
                n_count: 10,
                ambiguity_character_count: 5,
                lineage: "B.1.1.7",
            };
            const row = {
                original: createMockCase({
                    sequence_analysis: {
                        id: 1,
                        fasta_hash: "hash123",
                        pathogen_id: 1,
                        result: viralResult,
                    },
                }),
            };
            expect(uploadedDataFilterFn(row, "any", "b.1.1.7", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "B.1", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "delta", undefined)).toBe(false);
        });

        it("should return false when lineage is null or undefined", () => {
            const row = {
                original: createMockCase({
                    sequence_analysis: undefined,
                }),
            };
            expect(uploadedDataFilterFn(row, "any", "lineage", undefined)).toBe(false);
        });

        it("should filter by outbreak name (object)", () => {
            const row = {
                original: createMockCase({
                    outbreak: { id: 1, name: "Outbreak2023", pathogen_id: 1, created_at: new Date() },
                }),
            };
            expect(uploadedDataFilterFn(row, "any", "outbreak2023", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "outbreak", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "other", undefined)).toBe(false);
        });

        it("should filter by outbreak name (string)", () => {
            const row = {
                original: createMockCase({
                    outbreak: "Spring2023" as any,
                }),
            };
            expect(uploadedDataFilterFn(row, "any", "spring2023", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "spring", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "winter", undefined)).toBe(false);
        });

        it("should return false when outbreak is null", () => {
            const row = { original: createMockCase({ outbreak: null }) };
            expect(uploadedDataFilterFn(row, "any", "outbreak", undefined)).toBe(false);
        });

        it("should filter by group name", () => {
            const row = {
                original: createMockCase({
                    groups: [
                        { id: 1, name: "Group A", category_id: 1, category: { id: 1, name: "Cat1", pathogen_id: 1 } },
                        { id: 2, name: "Group B", category_id: 1, category: { id: 1, name: "Cat1", pathogen_id: 1 } },
                    ],
                }),
            };
            expect(uploadedDataFilterFn(row, "any", "group a", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "group b", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "group c", undefined)).toBe(false);
        });

        it("should return false when groups is null or empty", () => {
            const row = { original: createMockCase({ groups: null }) };
            expect(uploadedDataFilterFn(row, "any", "group", undefined)).toBe(false);

            const row2 = { original: createMockCase({ groups: [] }) };
            expect(uploadedDataFilterFn(row2, "any", "group", undefined)).toBe(false);
        });

        it("should filter by category name (object)", () => {
            const row = {
                original: createMockCase({
                    groups: [
                        {
                            id: 1,
                            name: "Group A",
                            category_id: 1,
                            category: { id: 1, name: "Healthcare", pathogen_id: 1 },
                        },
                    ],
                }),
            };
            expect(uploadedDataFilterFn(row, "any", "healthcare", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "health", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "other", undefined)).toBe(false);
        });

        it("should filter by registered_at date", () => {
            const date = new Date(2025, 0, 15); // January 15, 2025
            const row = { original: createMockCase({ registered_at: date }) };
            expect(uploadedDataFilterFn(row, "any", "15.01.2025", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "15.01", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "2025", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "99.99.9999", undefined)).toBe(false);
        });

        it("should return false when registered_at is null", () => {
            const row = { original: createMockCase({ registered_at: null as any }) };
            expect(uploadedDataFilterFn(row, "any", "2025", undefined)).toBe(false);
        });

        it("should match multiple filter criteria", () => {
            const row = {
                original: createMockCase({
                    case_id: "CASE123",
                    fasta_id: "FASTA456",
                    groups: [
                        { id: 1, name: "Group A", category_id: 1, category: { id: 1, name: "Cat1", pathogen_id: 1 } },
                    ],
                }),
            };
            expect(uploadedDataFilterFn(row, "any", "case", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "fasta", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "group", undefined)).toBe(true);
        });
    });

    describe("caseImportFilterFn", () => {
        const createMockCaseImport = (overrides: Partial<CaseImport> = {}): CaseImport => ({
            case_id: "CASE001",
            fasta_id: "FASTA001",
            groups: [{ name: "Group1", category: "Cat1" }],
            outbreak: "Outbreak1",
            infected_by: null,
            street: null,
            zip_code: null,
            city: null,
            first_name: null,
            last_name: null,
            registered_at: new Date(2025, 0, 15),
            ...overrides,
        });

        it("should filter by case_id", () => {
            const row = { original: createMockCaseImport({ case_id: "CASE789" }) };
            expect(caseImportFilterFn(row, "any", "case789", undefined)).toBe(true);
            expect(caseImportFilterFn(row, "any", "case", undefined)).toBe(true);
            expect(caseImportFilterFn(row, "any", "xyz", undefined)).toBe(false);
        });

        it("should filter by fasta_id", () => {
            const row = { original: createMockCaseImport({ fasta_id: "FASTA999" }) };
            expect(caseImportFilterFn(row, "any", "fasta999", undefined)).toBe(true);
            expect(caseImportFilterFn(row, "any", "999", undefined)).toBe(true);
        });

        it("should filter by outbreak name", () => {
            const row = { original: createMockCaseImport({ outbreak: "Spring2024" }) };
            expect(caseImportFilterFn(row, "any", "spring2024", undefined)).toBe(true);
            expect(caseImportFilterFn(row, "any", "spring", undefined)).toBe(true);
        });

        it("should filter by group name", () => {
            const row = {
                original: createMockCaseImport({
                    groups: [
                        { name: "Hospital A", category: "Healthcare" },
                        { name: "School B", category: "Education" },
                    ],
                }),
            };
            expect(caseImportFilterFn(row, "any", "hospital", undefined)).toBe(true);
            expect(caseImportFilterFn(row, "any", "school b", undefined)).toBe(true);
        });

        it("should filter by registered_at date", () => {
            const date = new Date(2024, 11, 25); // December 25, 2024
            const row = { original: createMockCaseImport({ registered_at: date }) };
            expect(caseImportFilterFn(row, "any", "25.12.2024", undefined)).toBe(true);
            expect(caseImportFilterFn(row, "any", "2024", undefined)).toBe(true);
        });
    });

    describe("caseUpdateFilterFn", () => {
        const createMockCaseUpdate = (
            importData: Partial<CaseImport> = {},
            existingData: Partial<CaseWithRelationships> = {}
        ) => ({
            case_id: "CASE001",
            fasta_id: "NEW_FASTA",
            groups: [{ name: "NewGroup", category: "NewCat" }],
            outbreak: "NewOutbreak",
            infected_by: null,
            street: null,
            zip_code: null,
            city: null,
            first_name: null,
            last_name: null,
            registered_at: new Date(2025, 0, 15),
            ...importData,
            existingCase: {
                id: 1,
                case_id: "CASE001",
                fasta_id: "OLD_FASTA",
                pathogen_id: 1,
                outbreak_id: 1,
                group_ids: [1],
                street: null,
                zip_code: null,
                city: null,
                first_name: null,
                last_name: null,
                infected_by: null,
                registered_at: new Date(2025, 0, 1),
                ...existingData,
            },
        });

        it("should filter by case_id", () => {
            const row = { original: createMockCaseUpdate({ case_id: "CASE555" }) };
            expect(caseUpdateFilterFn(row, "any", "case555", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "case", undefined)).toBe(true);
        });

        it("should filter by imported fasta_id", () => {
            const row = { original: createMockCaseUpdate({ fasta_id: "IMPORT_FASTA" }) };
            expect(caseUpdateFilterFn(row, "any", "import_fasta", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "import", undefined)).toBe(true);
        });

        it("should filter by existing fasta_id", () => {
            const row = { original: createMockCaseUpdate({}, { fasta_id: "EXISTING_FASTA" }) };
            expect(caseUpdateFilterFn(row, "any", "existing_fasta", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "existing", undefined)).toBe(true);
        });

        it("should filter by both imported and existing fasta_id", () => {
            const row = {
                original: createMockCaseUpdate({ fasta_id: "IMPORT_FASTA" }, { fasta_id: "EXISTING_FASTA" }),
            };
            expect(caseUpdateFilterFn(row, "any", "import", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "existing", undefined)).toBe(true);
        });

        it("should filter by imported outbreak name", () => {
            const row = { original: createMockCaseUpdate({ outbreak: "NewOutbreak2024" }) };
            expect(caseUpdateFilterFn(row, "any", "newoutbreak2024", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "newoutbreak", undefined)).toBe(true);
        });

        it("should filter by existing outbreak name", () => {
            const row = {
                original: createMockCaseUpdate(
                    {},
                    { outbreak: { id: 1, name: "OldOutbreak", pathogen_id: 1, created_at: new Date() } }
                ),
            };
            expect(caseUpdateFilterFn(row, "any", "oldoutbreak", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "old", undefined)).toBe(true);
        });

        it("should filter by imported category name", () => {
            const row = {
                original: createMockCaseUpdate({
                    groups: [{ name: "Group1", category: "ImportedCategory" }],
                }),
            };
            expect(caseUpdateFilterFn(row, "any", "importedcategory", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "imported", undefined)).toBe(true);
        });

        it("should filter by existing category name", () => {
            const row = {
                original: createMockCaseUpdate(
                    {},
                    {
                        groups: [
                            {
                                id: 1,
                                name: "Group1",
                                category_id: 1,
                                category: { id: 1, name: "ExistingCategory", pathogen_id: 1 },
                            },
                        ],
                    }
                ),
            };
            expect(caseUpdateFilterFn(row, "any", "existingcategory", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "existing", undefined)).toBe(true);
        });

        it("should filter by imported group name", () => {
            const row = {
                original: createMockCaseUpdate({
                    groups: [{ name: "ImportedGroup", category: "Cat1" }],
                }),
            };
            expect(caseUpdateFilterFn(row, "any", "importedgroup", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "imported", undefined)).toBe(true);
        });

        it("should filter by existing group name", () => {
            const row = {
                original: createMockCaseUpdate(
                    {},
                    {
                        groups: [
                            {
                                id: 1,
                                name: "ExistingGroup",
                                category_id: 1,
                                category: { id: 1, name: "Cat1", pathogen_id: 1 },
                            },
                        ],
                    }
                ),
            };
            expect(caseUpdateFilterFn(row, "any", "existinggroup", undefined)).toBe(true);
            expect(caseUpdateFilterFn(row, "any", "existing", undefined)).toBe(true);
        });
    });

    describe("sequenceImportFilterFn", () => {
        const createMockSequenceImport = (overrides: Partial<CaseWithRelationships> = {}): CaseWithRelationships => ({
            id: 1,
            case_id: "CASE001",
            fasta_id: "FASTA001",
            pathogen_id: 1,
            outbreak_id: null,
            group_ids: [],
            street: null,
            zip_code: null,
            city: null,
            first_name: null,
            last_name: null,
            infected_by: null,
            registered_at: new Date(2025, 0, 15),
            ...overrides,
        });

        it("should filter by case_id", () => {
            const row = { original: createMockSequenceImport({ case_id: "SEQ_CASE_001" }) };
            expect(sequenceImportFilterFn(row, "any", "seq_case_001", undefined)).toBe(true);
            expect(sequenceImportFilterFn(row, "any", "seq_case", undefined)).toBe(true);
            expect(sequenceImportFilterFn(row, "any", "other", undefined)).toBe(false);
        });

        it("should filter by fasta_id", () => {
            const row = { original: createMockSequenceImport({ fasta_id: "SEQ_FASTA_999" }) };
            expect(sequenceImportFilterFn(row, "any", "seq_fasta_999", undefined)).toBe(true);
            expect(sequenceImportFilterFn(row, "any", "seq_fasta", undefined)).toBe(true);
            expect(sequenceImportFilterFn(row, "any", "other", undefined)).toBe(false);
        });

        it("should return false when fasta_id is null", () => {
            const row = { original: createMockSequenceImport({ fasta_id: null }) };
            expect(sequenceImportFilterFn(row, "any", "fasta", undefined)).toBe(false);
        });

        it("should match case_id or fasta_id", () => {
            const row = {
                original: createMockSequenceImport({
                    case_id: "CASE123",
                    fasta_id: "FASTA456",
                }),
            };
            expect(sequenceImportFilterFn(row, "any", "case123", undefined)).toBe(true);
            expect(sequenceImportFilterFn(row, "any", "fasta456", undefined)).toBe(true);
        });
    });

    describe("contactImportFilterFn", () => {
        const createMockContactImport = (overrides: Partial<ContactImport> = {}): ContactImport => ({
            case_id_1: "CASE001",
            case_id_2: "CASE002",
            type: "household",
            context: "family",
            ...overrides,
        });

        it("should filter by case_id_1", () => {
            const row = { original: createMockContactImport({ case_id_1: "CONTACT_CASE_A" }) };
            expect(contactImportFilterFn(row, "any", "contact_case_a", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "contact", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "other", undefined)).toBe(false);
        });

        it("should filter by case_id_2", () => {
            const row = { original: createMockContactImport({ case_id_2: "CONTACT_CASE_B" }) };
            expect(contactImportFilterFn(row, "any", "contact_case_b", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "case_b", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "other", undefined)).toBe(false);
        });

        it("should filter by either case_id_1 or case_id_2", () => {
            const row = {
                original: createMockContactImport({
                    case_id_1: "CASE_AAA",
                    case_id_2: "CASE_BBB",
                }),
            };
            expect(contactImportFilterFn(row, "any", "case_aaa", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "case_bbb", undefined)).toBe(true);
        });

        it("should filter by contact type", () => {
            const row = { original: createMockContactImport({ type: "workplace" }) };
            expect(contactImportFilterFn(row, "any", "workplace", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "work", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "household", undefined)).toBe(false);
        });

        it("should filter by contact context", () => {
            const row = { original: createMockContactImport({ context: "school event" }) };
            expect(contactImportFilterFn(row, "any", "school event", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "school", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "family", undefined)).toBe(false);
        });

        it("should match multiple criteria", () => {
            const row = {
                original: createMockContactImport({
                    case_id_1: "CASE123",
                    case_id_2: "CASE456",
                    type: "workplace",
                    context: "office",
                }),
            };
            expect(contactImportFilterFn(row, "any", "case123", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "case456", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "workplace", undefined)).toBe(true);
            expect(contactImportFilterFn(row, "any", "office", undefined)).toBe(true);
        });
    });

    describe("case insensitivity", () => {
        it("should handle mixed case search values", () => {
            const row = {
                original: {
                    id: 1,
                    case_id: "CaSe123",
                    fasta_id: "FaStA456",
                    pathogen_id: 1,
                    outbreak_id: null,
                    group_ids: [],
                    street: null,
                    zip_code: null,
                    city: null,
                    first_name: null,
                    last_name: null,
                    infected_by: null,
                    registered_at: new Date(2025, 0, 15),
                },
            };
            expect(uploadedDataFilterFn(row, "any", "CaSe123", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "cAsE123", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "FASTA456", undefined)).toBe(true);
            expect(uploadedDataFilterFn(row, "any", "fasta456", undefined)).toBe(true);
        });
    });
});
