import { describe, it, expect, beforeEach, vi } from "vitest";
import { CasesValidation } from "@/modules/data_management/services/data_import/validation/CasesValidation";
import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";
import { createOutbreak } from "@/modules/core/tests/entities/outbreaks";
import { createGroup, createGroups } from "@/modules/core/tests/entities/groups";
import { createCase } from "@/modules/core/tests/entities/cases";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { GroupSchema } from "@/modules/core/models/groups";
import { CategorySchema } from "@/modules/core/models/categories";
import { createCategory } from "@/modules/core/tests/entities/categories";

describe("CasesValidation", () => {
    let casesValidationStrategy: any;

    beforeEach(() => {
        casesValidationStrategy = new CasesValidation();
    });

    describe("isCasesHeaderValid", () => {
        it("should detect valid header when passing correct column names", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            const result = casesValidationStrategy.isCasesHeaderValid(header);

            expect(result).toBeTruthy();
        });

        it("should detect valid header when passing up to 3 flxeible category names", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            for (let categoryIndex = 1; categoryIndex <= 3; categoryIndex++) {
                header.push(`:flexible_category_${categoryIndex}:`);
                const result = casesValidationStrategy.isCasesHeaderValid(header);
                expect(result).toBeTruthy();
            }
        });

        it("should detect valid header when passing more than 3 flxeible category names", () => {
            const header = [
                "Fall ID",
                "Sequenz ID",
                "Registrierungsdatum",
                "Ausbruch",
                ":flexible_category_1:",
                ":flexible_category_2:",
                ":flexible_category_3:",
                ":flexible_category_4:",
            ];
            const result = casesValidationStrategy.isCasesHeaderValid(header);
            expect(result).toBeFalsy();
        });

        it("should detect valid header when a required column is missing", () => {
            const header = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
            for (let index = 0; index < header.length; index++) {
                const tempHeader = structuredClone(header);
                tempHeader[index] = ":incorrect_column_name:";
                const result = casesValidationStrategy.isCasesHeaderValid(tempHeader);
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

        it("should detect that new group was assigned", () => {
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
        let categories: CategorySchema[] = [];

        beforeEach(() => {
            const category1 = createCategory({ id: 1, name: ":category_1:" });
            const group1 = createGroup({ id: 1, name: ":group_1:", category: category1 });
            const category2 = createCategory({ id: 2, name: ":category_2:" });
            const group2 = createGroup({ id: 2, name: ":group_2:", category: category2 });
            const category3 = createCategory({ id: 3, name: ":category_3:" });
            const group3 = createGroup({ id: 3, name: ":group_3:", category: category3 });
            categories = [category1, category2, category3];
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
                    ":case_id_column:",
                    ":fasta_id_column:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    categories[0].name,
                    categories[1].name,
                    categories[2].name,
                ],
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
                    ":case_id_column:",
                    ":fasta_id_column:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    categories[0].name,
                    categories[1].name,
                    categories[2].name,
                ],
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
                    ":case_id_column:",
                    ":fasta_id_column:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    categories[0].name,
                    categories[1].name,
                    categories[2].name,
                ],
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
                    ":case_id_column:",
                    ":fasta_id_column:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    categories[0].name,
                    categories[1].name,
                    categories[2].name,
                ],
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
                    ":case_id_column:",
                    ":fasta_id_column:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    categories[0].name,
                    categories[1].name,
                    categories[2].name,
                ],
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
                    ":case_id_column:",
                    ":fasta_id_column:",
                    ":registered_at_column:",
                    ":outbreak_column:",
                    categories[0].name,
                    categories[1].name,
                    categories[2].name,
                ],
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
});
