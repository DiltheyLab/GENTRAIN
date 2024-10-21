import { describe, it, expect, beforeEach } from "vitest";
import { CasesValidation } from "@/modules/data_management/services/data_import/validation/CasesValidation";

describe("CasesValidation", () => {
    let casesValidationStrategy: any;

    beforeEach(() => {
        casesValidationStrategy = new CasesValidation();
    });

    describe("validate", () => {
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
});
