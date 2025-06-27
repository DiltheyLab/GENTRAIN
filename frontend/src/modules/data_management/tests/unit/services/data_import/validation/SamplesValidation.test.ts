import { describe, it, expect, beforeEach } from "vitest";
import { SequencesValidation } from "@/modules/data_management/services/data_import/validation/SequencesValidation";

describe("SequencesValidation", () => {
    let SequencesValidationStrategy: any;

    beforeEach(() => {
        SequencesValidationStrategy = new SequencesValidation();
    });

    describe("isHeaderValid", () => {
        it("should return false for samplemupload", () => {
            const result = SequencesValidationStrategy.isHeaderValid();

            expect(result).toBeFalsy();
        });
    });
});
