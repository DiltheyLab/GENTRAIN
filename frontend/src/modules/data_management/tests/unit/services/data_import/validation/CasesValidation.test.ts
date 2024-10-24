import { describe, it, expect, beforeEach } from "vitest";
import { CasesValidation } from "@/modules/data_management/services/data_import/validation/CasesValidation";
import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";
import { createOutbreak } from "@/modules/core/tests/entities/outbreaks";
import { createGroup, createGroups } from "@/modules/core/tests/entities/groups";
import { createCase } from "@/modules/core/tests/entities/cases";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { GroupSchema } from "@/modules/core/models/groups";
import { CategorySchema } from "@/modules/core/models/categories";
import { createCategory } from "@/modules/core/tests/entities/categories";
import { ObjectRelationalMapper } from "@/modules/core/services/database/ObjectRelationalMapper";
import { formatDate } from "@/modules/core/helpers/dates";

describe("CasesValidation", () => {
    let casesValidationStrategy: any;

    beforeEach(() => {
        casesValidationStrategy = new CasesValidation();
    });

    describe("isHeaderValid", () => {
        it("should return false when data was not yet collected", () => {
            const result = casesValidationStrategy.isHeaderValid();

            expect(result).toBeFalsy();
        });

        it("should detect valid header when passing correct column names", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            casesValidationStrategy.collectData([header]);
            const result = casesValidationStrategy.isHeaderValid();

            expect(result).toBeTruthy();
        });

        it("should detect valid header when passing up to 3 flexible category names", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch", ":additional_column:"];
            casesValidationStrategy.collectData([header]);
            const result = casesValidationStrategy.isHeaderValid();
            expect(result).toBeTruthy();
        });

        it("should detect valid header when a required column is missing", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            for (let index = 0; index < header.length; index++) {
                const tempHeader = structuredClone(header);
                tempHeader[index] = ":incorrect_column_name:";
                casesValidationStrategy.collectData([tempHeader]);
                const result = casesValidationStrategy.isHeaderValid();
                expect(result).toBeFalsy();
            }
        });
    });

    describe("isCasesHeaderValid", () => {
        it("should detect valid header when passing correct column names", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            casesValidationStrategy.collectData([header]);
            const result = casesValidationStrategy.isCasesHeaderValid();

            expect(result).toBeTruthy();
        });

        it("should detect valid header when passing up to 3 flexible category names", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            for (let categoryIndex = 1; categoryIndex <= 3; categoryIndex++) {
                header.push(`:category_${categoryIndex}:`);
                casesValidationStrategy.collectData([header]);
                const result = casesValidationStrategy.isCasesHeaderValid();
                expect(result).toBeTruthy();
            }
        });

        it("should detect invalid header when passing more than 3 flexible category names", () => {
            const header = [
                "Fall ID",
                "Sequenz ID",
                "Registrierungsdatum",
                "Ausbruch",
                ":category_1:",
                ":category_2:",
                ":category_3:",
                ":category_4:",
            ];
            casesValidationStrategy.collectData([header]);
            const result = casesValidationStrategy.isCasesHeaderValid();
            expect(result).toBeFalsy();
        });

        it("should detect valid header when a required column is missing", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            for (let index = 0; index < header.length; index++) {
                const tempHeader = structuredClone(header);
                tempHeader[index] = ":incorrect_column_name:";
                casesValidationStrategy.collectData([tempHeader]);
                const result = casesValidationStrategy.isCasesHeaderValid();
                expect(result).toBeFalsy();
            }
        });
    });

    describe("importedCaseEqualsPersistedCase", () => {
        let outbreak: OutbreakSchema;
        let groups: GroupSchema[];
        let registeredAt: Date;

        beforeEach(() => {
            outbreak = createOutbreak({ id: 1, name: ":outbreak_name:" });
            groups = createGroups();
            registeredAt = new Date();
        });

        it("should detect equality between imported and persisted case", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups.map((group) => {
                    return { category: ":category_1:", name: group.name, remaining: true };
                }),
                outbreak: outbreak.name,
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeTruthy();
        });

        it("should detect differing fasta ids", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id_1:",
                groups: groups.map((group) => {
                    return { category: ":category_1:", name: group.name, remaining: true };
                }),
                outbreak: outbreak.name,
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id_2:",
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeFalsy();
        });

        it("should detect differing outbreak name", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups.map((group) => {
                    return { category: ":category_1:", name: group.name, remaining: true };
                }),
                outbreak: ":other_outbreak_name:",
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeFalsy();
        });

        it("should detect differing registered at date", () => {
            const otherDate = new Date(registeredAt.getDate() + 1);
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups.map((group) => {
                    return { category: ":category_name:", name: group.name, remaining: true };
                }),
                outbreak: outbreak.name,
                registered_at: otherDate,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeFalsy();
        });

        it("should detect that new group was assigned to the imported case", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups.map((group) => {
                    return { category: ":category_name:", name: group.name, remaining: group.id === 0 ? false : true };
                }),
                outbreak: outbreak.name,
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeFalsy();
        });

        it("should detect that a group was removed", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups
                    .filter((group) => group.id !== 0)
                    .map((group) => {
                        return {
                            category: ":category_name:",
                            name: group.name,
                            remaining: true,
                        };
                    }),
                outbreak: outbreak.name,
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeFalsy();
        });

        it("should detect that an imported fasta id is empty", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: null,
                groups: groups.map((group) => {
                    return { category: ":category_name:", name: group.name, remaining: true };
                }),
                outbreak: outbreak.name,
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeFalsy();
        });

        it("should detect that a persisted fasta id is empty", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id",
                groups: groups.map((group) => {
                    return { category: ":category_name:", name: group.name, remaining: true };
                }),
                outbreak: outbreak.name,
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: null,
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeFalsy();
        });

        it("should detect that a outbreak are empty for imported and persisted case", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups.map((group) => {
                    return { category: ":category_name:", name: group.name, remaining: true };
                }),
                outbreak: null,
                registered_at: registeredAt,
            };
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                groups: groups,
                outbreak: null,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.importedCaseEqualsPersistedCase(importedCase, persistedCase);

            expect(result).toBeTruthy();
        });
    });

    describe("collectNewGroups", () => {
        let outbreak: OutbreakSchema;
        let registeredAt: Date;
        let groups: GroupSchema[] = [];

        beforeEach(() => {
            casesValidationStrategy.collectData([
                [
                    "Fall ID",
                    "Sequenz ID",
                    "Registrierungsdatum",
                    "Ausbruch",
                    ":category_1:",
                    ":category_2:",
                    ":category_3:",
                ],
            ]);
            const category1 = createCategory({ id: 1, name: ":category_1:" });
            const group1 = createGroup({ id: 1, name: ":group_1:", category: category1 });
            const category2 = createCategory({ id: 2, name: ":category_2:" });
            const group2 = createGroup({ id: 2, name: ":group_2:", category: category2 });
            const category3 = createCategory({ id: 3, name: ":category_3:" });
            const group3 = createGroup({ id: 3, name: ":group_3:", category: category3 });
            groups = [group1, group2, group3];
            outbreak = createOutbreak({ id: 1, name: ":outbreak_name:" });
            registeredAt = new Date();
        });

        it("should detect remaining groups for persisted case", () => {
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                group_ids: groups.map((group) => group.id),
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });

            const result = casesValidationStrategy.collectNewGroups(
                [
                    ":case_id:",
                    ":fasta_id:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    groups[0].name,
                    groups[1].name,
                    groups[2].name,
                ],
                persistedCase
            );
            for (const group of result) {
                expect(group.remaining).toBeTruthy();
            }
        });

        it("should detect new group for first flexible column", () => {
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                group_ids: groups.map((group) => group.id),
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });

            const result = casesValidationStrategy.collectNewGroups(
                [
                    ":case_id:",
                    ":fasta_id:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    ":new_group:",
                    groups[1].name,
                    groups[2].name,
                ],
                persistedCase
            );

            expect(result[0].remaining).toBeFalsy();
        });

        it("should detect new group for second flexible column", () => {
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                group_ids: groups.map((group) => group.id),
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.collectNewGroups(
                [
                    ":case_id:",
                    ":fasta_id:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    groups[0].name,
                    ":new_group:",
                    groups[2].name,
                ],
                persistedCase
            );

            expect(result[1].remaining).toBeFalsy();
        });

        it("should detect new group for first flexible column", () => {
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                group_ids: groups.map((group) => group.id),
                groups: groups,
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.collectNewGroups(
                [
                    ":case_id:",
                    ":fasta_id:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    groups[0].name,
                    groups[1].name,
                    ":new_group:",
                ],
                persistedCase
            );

            expect(result[2].remaining).toBeFalsy();
        });

        it("should detect new groups for undefined persisted case", () => {
            const result = casesValidationStrategy.collectNewGroups(
                [
                    ":case_id:",
                    ":fasta_id:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    groups[0].name,
                    groups[1].name,
                    ":new_group:",
                ],
                undefined
            );

            for (const group of result) {
                expect(group.remaining).toBeFalsy();
            }
        });

        it("should detect new groups for undefined groups array", () => {
            const persistedCase: CaseWithRelationships = createCase({
                case_id: ":case_id:",
                fasta_id: ":fasta_id:",
                group_ids: groups.map((group) => group.id),
                outbreak: outbreak,
                registered_at: registeredAt,
            });
            const result = casesValidationStrategy.collectNewGroups(
                [
                    ":case_id:",
                    ":fasta_id:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    groups[0].name,
                    groups[1].name,
                    groups[2].name,
                ],
                persistedCase
            );

            for (const group of result) {
                expect(group.remaining).toBeFalsy();
            }
        });
    });
    describe("collectImportedAndPersistedCases", () => {
        let header: string[];
        beforeEach(() => {
            header = [
                "Fall ID",
                "Sequenz ID",
                "Registrierungsdatum",
                "Ausbruch",
                ":category_1:",
                ":category_2:",
                ":category_3:",
            ];
        });

        it("should only contain imported case if case does not exists", () => {
            const data = [[":case_id:", ":fasta_id:", "01.01.2021", ":outbreak_name:", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(Object.keys(result).includes(":case_id:")).toBeTruthy();
            expect(result[":case_id:"].persisted).toBeNull();
        });

        it("should return true for import boolean", () => {
            const data = [[":case_id:", ":fasta_id:", "01.01.2021", ":outbreak_name:", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(result[":case_id:"].import).toBeTruthy();
        });

        it("should contain imported and persisted case if case does exists", () => {
            const data = [[":case_id:", ":fasta_id:", "01.01.2021", ":outbreak_name:", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            casesValidationStrategy.cases = ObjectRelationalMapper.arrayToMap(
                [createCase({ case_id: ":case_id:" })],
                "case_id"
            );
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(Object.keys(result).includes(":case_id:")).toBeTruthy();
            expect(result[":case_id:"].persisted.case_id).toEqual(":case_id:");
        });

        it("should return null for fasta_id of imported case if it is not set", () => {
            const data = [[":case_id:", "", "01.01.2021", ":outbreak_name:", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(result[":case_id:"].imported.fasta_id).toBeNull();
        });

        it("should return null for outbreak of imported case if it is not set", () => {
            const data = [[":case_id:", ":fasta_id:", "01.01.2021", "", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(result[":case_id:"].imported.outbreak).toBeNull();
        });

        it("should return null for outbreak of persisted case if it does not exist in database", () => {
            const data = [[":case_id:", ":fasta_id:", "01.01.2021", ":outbreak_name:", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            casesValidationStrategy.cases = ObjectRelationalMapper.arrayToMap(
                [createCase({ case_id: ":case_id:", outbreak_id: 0 })],
                "case_id"
            );
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(result[":case_id:"].persisted.outbreak).toBeNull();
        });

        it("should contain outbreak of persisted case if it exists in database", () => {
            const outbreak = createOutbreak({ id: 0, name: ":outbreak_name:" });
            const data = [[":case_id:", ":fasta_id:", "01.01.2021", ":outbreak_name:", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            casesValidationStrategy.cases = ObjectRelationalMapper.arrayToMap(
                [createCase({ case_id: ":case_id:", outbreak_id: outbreak.id })],
                "case_id"
            );
            casesValidationStrategy.outbreaks = ObjectRelationalMapper.arrayToMap([outbreak]);
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(result[":case_id:"].persisted.outbreak).toEqual(outbreak);
        });

        it("should not contain outbreak of persisted case if it does not exists in database", () => {
            const data = [[":case_id:", ":fasta_id:", "01.01.2021", ":outbreak_name:", ":group_name:"]];
            casesValidationStrategy.collectData([header, ...data]);
            casesValidationStrategy.cases = ObjectRelationalMapper.arrayToMap(
                [createCase({ case_id: ":case_id:", outbreak_id: 0 })],
                "case_id"
            );
            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(result[":case_id:"].persisted.outbreak).toBeNull();
        });

        it("should ignore equal imported and persisted cases", () => {
            const outbreak = createOutbreak({ id: 0, name: ":outbreak_name:" });
            const category = createCategory({ name: ":category_1:" });
            const group = createGroup({ id: 0, name: ":group_name:", category_id: category.id, category: category });
            const registeredAt = new Date();
            const data = [[":case_id:", ":fasta_id:", formatDate(registeredAt), outbreak.name, group.name, "", ""]];
            casesValidationStrategy.collectData([header, ...data]);
            casesValidationStrategy.cases = ObjectRelationalMapper.arrayToMap(
                [
                    createCase({
                        case_id: ":case_id:",
                        fasta_id: ":fasta_id:",
                        registered_at: registeredAt,
                        outbreak_id: outbreak.id,
                        outbreak: outbreak,
                        group_ids: [group.id],
                        groups: [group],
                    }),
                ],
                "case_id"
            );
            casesValidationStrategy.outbreaks = ObjectRelationalMapper.arrayToMap([outbreak]);

            const result = casesValidationStrategy.collectImportedAndPersistedCases();
            expect(Object.keys(result).includes(":case_id:")).toBeFalsy();
        });
    });
});
