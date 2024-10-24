import { describe, it, expect, beforeEach } from "vitest";
import { SamplesValidation } from "@/modules/data_management/services/data_import/validation/SamplesValidation";

describe("SamplesValidation", () => {
    let samplesValidationStrategy: any;

    beforeEach(() => {
        samplesValidationStrategy = new SamplesValidation();
    });

    describe("isHeaderValid", () => {
        it("should return false for samplemupload", () => {
            const result = samplesValidationStrategy.isHeaderValid();

            expect(result).toBeFalsy();
        });
    });
});
