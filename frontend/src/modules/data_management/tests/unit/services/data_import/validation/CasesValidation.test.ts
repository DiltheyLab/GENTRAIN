import { describe, it, expect, beforeEach } from "vitest";
import { CasesValidation } from "@/modules/data_management/services/data_import/validation/CasesValidation";
import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";
import { createOutbreak } from "@/modules/core/tests/entities/outbreaks";
import { createGroups } from "@/modules/core/tests/entities/groups";
import { createCase } from "@/modules/core/tests/entities/cases";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { GroupSchema } from "@/modules/core/models/groups";

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
            groups = createGroups(3);
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
                outbreak: ":other_outbreak_name",
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

        it("should detect that a imported fasta id is empty", () => {
            const importedCase: CaseImport = {
                case_id: ":case_id:",
                fasta_id: null,
                groups: groups
                    .filter((group) => group.id !== 0)
                    .map((group) => {
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
                groups: groups
                    .filter((group) => group.id !== 0)
                    .map((group) => {
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
    });
});
