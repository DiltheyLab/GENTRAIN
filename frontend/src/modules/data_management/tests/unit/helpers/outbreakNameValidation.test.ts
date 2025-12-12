import { describe, it, expect } from "vitest";
import { validateOutbreakName } from "@/modules/data_management/helpers/outbreakNameValidation";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";

describe("validateOutbreakName", () => {
    const createMockOutbreak = (overrides: Partial<OutbreakSchema> = {}): OutbreakSchema => ({
        id: 1,
        name: "Test Outbreak",
        pathogen_id: 1,
        ...overrides,
    });

    describe("isUniqueName", () => {
        it("should return true when outbreak name is unique", () => {
            const outbreaks = [
                createMockOutbreak({ id: 1, name: "Outbreak A" }),
                createMockOutbreak({ id: 2, name: "Outbreak B" }),
            ];
            const result = validateOutbreakName(outbreaks, "Outbreak C");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should return false when outbreak name already exists", () => {
            const outbreaks = [
                createMockOutbreak({ id: 1, name: "Outbreak A" }),
                createMockOutbreak({ id: 2, name: "Outbreak B" }),
            ];
            const result = validateOutbreakName(outbreaks, "Outbreak A");

            expect(result.isUniqueName()).toBe(false);
        });

        it("should be case sensitive", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "outbreak a");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should return true when outbreaks array is undefined", () => {
            const result = validateOutbreakName(undefined, "New Outbreak");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should return true when outbreaks array is empty", () => {
            const result = validateOutbreakName([], "New Outbreak");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should handle exact name matches", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "COVID-19 Outbreak 2023" })];
            const result = validateOutbreakName(outbreaks, "COVID-19 Outbreak 2023");

            expect(result.isUniqueName()).toBe(false);
        });

        it("should not match partial names", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "COVID-19 Outbreak 2023" })];
            const result = validateOutbreakName(outbreaks, "COVID-19");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should detect duplicate when checking multiple outbreaks", () => {
            const outbreaks = [
                createMockOutbreak({ id: 1, name: "Outbreak A" }),
                createMockOutbreak({ id: 2, name: "Outbreak B" }),
                createMockOutbreak({ id: 3, name: "Outbreak C" }),
            ];
            const result = validateOutbreakName(outbreaks, "Outbreak B");

            expect(result.isUniqueName()).toBe(false);
        });
    });

    describe("nameLengthIsValid", () => {
        it("should return true for valid length names", () => {
            const result = validateOutbreakName([], "Valid Outbreak Name");

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should return false for empty string", () => {
            const result = validateOutbreakName([], "");

            expect(result.nameLengthIsValid()).toBe(false);
        });

        it("should return true for single character name", () => {
            const result = validateOutbreakName([], "A");

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should return true for name with 99 characters", () => {
            const longName = "A".repeat(99);
            const result = validateOutbreakName([], longName);

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should return false for name with 100 characters (at max length)", () => {
            const maxLengthName = "A".repeat(100);
            const result = validateOutbreakName([], maxLengthName);

            expect(result.nameLengthIsValid()).toBe(false);
        });

        it("should return false for name exceeding 100 characters", () => {
            const tooLongName = "A".repeat(101);
            const result = validateOutbreakName([], tooLongName);

            expect(result.nameLengthIsValid()).toBe(false);
        });

        it("should handle names with spaces", () => {
            const result = validateOutbreakName([], "Outbreak Name With Spaces");

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should handle names with special characters", () => {
            const result = validateOutbreakName([], "Outbreak-2023_v1.0!@#");

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should handle names with numbers", () => {
            const result = validateOutbreakName([], "COVID-19 2023");

            expect(result.nameLengthIsValid()).toBe(true);
        });
    });

    describe("outbreakNameNotValid", () => {
        it("should return true when name is valid length and unique", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "Outbreak B");

            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should return false when name is not unique", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "Outbreak A");

            expect(result.outbreakNameNotValid()).toBe(false);
        });

        it("should return false when name is empty", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "");

            expect(result.outbreakNameNotValid()).toBe(false);
        });

        it("should return false when name is too long", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const tooLongName = "A".repeat(101);
            const result = validateOutbreakName(outbreaks, tooLongName);

            expect(result.outbreakNameNotValid()).toBe(false);
        });

        it("should return false when name is at max length (100 chars)", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const maxLengthName = "A".repeat(100);
            const result = validateOutbreakName(outbreaks, maxLengthName);

            expect(result.outbreakNameNotValid()).toBe(false);
        });

        it("should return true when name is 99 characters and unique", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const longButValidName = "A".repeat(99);
            const result = validateOutbreakName(outbreaks, longButValidName);

            expect(result.outbreakNameNotValid()).toBe(true);
        });
    });

    describe("combined validation scenarios", () => {
        it("should validate a completely new outbreak with valid name", () => {
            const outbreaks = [
                createMockOutbreak({ id: 1, name: "Flu 2023" }),
                createMockOutbreak({ id: 2, name: "COVID-19 2024" }),
            ];
            const result = validateOutbreakName(outbreaks, "Measles 2025");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should reject duplicate name even if length is valid", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Flu 2023" })];
            const result = validateOutbreakName(outbreaks, "Flu 2023");

            expect(result.isUniqueName()).toBe(false);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(false);
        });

        it("should reject empty name even if unique", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Flu 2023" })];
            const result = validateOutbreakName(outbreaks, "");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(false);
            expect(result.outbreakNameNotValid()).toBe(false);
        });

        it("should reject too long name even if unique", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Flu 2023" })];
            const tooLongName = "A".repeat(150);
            const result = validateOutbreakName(outbreaks, tooLongName);

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(false);
            expect(result.outbreakNameNotValid()).toBe(false);
        });

        it("should handle validation with no existing outbreaks", () => {
            const result = validateOutbreakName([], "First Outbreak");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should handle validation with undefined outbreaks", () => {
            const result = validateOutbreakName(undefined, "New Outbreak");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });
    });

    describe("edge cases", () => {
        it("should handle names with only whitespace characters", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "   ");

            expect(result.nameLengthIsValid()).toBe(true); // Length is > 0 and < 100
            expect(result.isUniqueName()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should handle names with leading/trailing spaces", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, " Outbreak B ");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should not match outbreak name with leading/trailing spaces against exact match", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, " Outbreak A ");

            expect(result.isUniqueName()).toBe(true); // " Outbreak A " !== "Outbreak A"
        });

        it("should handle unicode characters in outbreak names", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "Ausbruch Ä");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should handle emoji in outbreak names", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "Outbreak 🦠");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should handle outbreak names with newlines", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "Outbreak\nB");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should handle outbreak names with tabs", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "Outbreak\tB");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
        });
    });

    describe("real-world scenarios", () => {
        it("should validate common outbreak naming patterns", () => {
            const outbreaks = [
                createMockOutbreak({ id: 1, name: "COVID-19 Spring 2023" }),
                createMockOutbreak({ id: 2, name: "Influenza H1N1 2022" }),
            ];
            const result = validateOutbreakName(outbreaks, "Measles Outbreak 2024");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should validate regional outbreak names", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Berlin Hospital Outbreak 2023" })];
            const result = validateOutbreakName(outbreaks, "Munich Clinic Outbreak 2024");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });

        it("should validate dated outbreak names", () => {
            const outbreaks = [
                createMockOutbreak({ id: 1, name: "January 2023 Outbreak" }),
                createMockOutbreak({ id: 2, name: "February 2023 Outbreak" }),
            ];
            const result = validateOutbreakName(outbreaks, "March 2023 Outbreak");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.outbreakNameNotValid()).toBe(true);
        });
    });

    describe("return value structure", () => {
        it("should return an object with three function properties", () => {
            const result = validateOutbreakName([], "Test");

            expect(result).toHaveProperty("isUniqueName");
            expect(result).toHaveProperty("nameLengthIsValid");
            expect(result).toHaveProperty("outbreakNameNotValid");
            expect(typeof result.isUniqueName).toBe("function");
            expect(typeof result.nameLengthIsValid).toBe("function");
            expect(typeof result.outbreakNameNotValid).toBe("function");
        });

        it("should allow calling validation functions multiple times", () => {
            const outbreaks = [createMockOutbreak({ id: 1, name: "Outbreak A" })];
            const result = validateOutbreakName(outbreaks, "Outbreak B");

            expect(result.isUniqueName()).toBe(true);
            expect(result.isUniqueName()).toBe(true); // Call again
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true); // Call again
        });
    });
});
