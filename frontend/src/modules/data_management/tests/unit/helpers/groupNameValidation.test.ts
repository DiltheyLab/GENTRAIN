import { describe, it, expect } from "vitest";
import { validateGroupName } from "@/modules/data_management/helpers/groupNameValidation";
import { GroupSchema } from "@/modules/core/models/groups";

describe("validateGroupName", () => {
    const createMockGroup = (overrides: Partial<GroupSchema> = {}): GroupSchema => ({
        id: 1,
        name: "Test Group",
        category_id: 1,
        pathogen_id: 1,
        ...overrides,
    });

    describe("isUniqueName", () => {
        it("should return true when group name is unique", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" }), createMockGroup({ id: 2, name: "Group B" })];
            const result = validateGroupName(groups, "Group C");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should return false when group name already exists", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" }), createMockGroup({ id: 2, name: "Group B" })];
            const result = validateGroupName(groups, "Group A");

            expect(result.isUniqueName()).toBe(false);
        });

        it("should be case sensitive", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "group a");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should return true when groups array is undefined", () => {
            const result = validateGroupName(undefined, "New Group");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should return true when groups array is empty", () => {
            const result = validateGroupName([], "New Group");

            expect(result.isUniqueName()).toBe(true);
        });

        it("should handle exact name matches", () => {
            const groups = [createMockGroup({ id: 1, name: "Healthcare Workers" })];
            const result = validateGroupName(groups, "Healthcare Workers");

            expect(result.isUniqueName()).toBe(false);
        });

        it("should not match partial names", () => {
            const groups = [createMockGroup({ id: 1, name: "Healthcare Workers" })];
            const result = validateGroupName(groups, "Healthcare");

            expect(result.isUniqueName()).toBe(true);
        });
    });

    describe("nameLengthIsValid", () => {
        it("should return true for valid length names", () => {
            const result = validateGroupName([], "Valid Group Name");

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should return false for empty string", () => {
            const result = validateGroupName([], "");

            expect(result.nameLengthIsValid()).toBe(false);
        });

        it("should return true for single character name", () => {
            const result = validateGroupName([], "A");

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should return true for name with 99 characters", () => {
            const longName = "A".repeat(99);
            const result = validateGroupName([], longName);

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should return false for name with 100 characters (at max length)", () => {
            const maxLengthName = "A".repeat(100);
            const result = validateGroupName([], maxLengthName);

            expect(result.nameLengthIsValid()).toBe(false);
        });

        it("should return false for name exceeding 100 characters", () => {
            const tooLongName = "A".repeat(101);
            const result = validateGroupName([], tooLongName);

            expect(result.nameLengthIsValid()).toBe(false);
        });

        it("should handle names with spaces", () => {
            const result = validateGroupName([], "Group Name With Spaces");

            expect(result.nameLengthIsValid()).toBe(true);
        });

        it("should handle names with special characters", () => {
            const result = validateGroupName([], "Group-Name_123!@#");

            expect(result.nameLengthIsValid()).toBe(true);
        });
    });

    describe("groupNameNotValid", () => {
        it("should return true when name is valid length and unique", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "Group B");

            expect(result.groupNameNotValid()).toBe(true);
        });

        it("should return false when name is not unique", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "Group A");

            expect(result.groupNameNotValid()).toBe(false);
        });

        it("should return false when name is empty", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "");

            expect(result.groupNameNotValid()).toBe(false);
        });

        it("should return false when name is too long", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const tooLongName = "A".repeat(101);
            const result = validateGroupName(groups, tooLongName);

            expect(result.groupNameNotValid()).toBe(false);
        });

        it("should return false when name is at max length (100 chars)", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const maxLengthName = "A".repeat(100);
            const result = validateGroupName(groups, maxLengthName);

            expect(result.groupNameNotValid()).toBe(false);
        });

        it("should return true when name is 99 characters and unique", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const longButValidName = "A".repeat(99);
            const result = validateGroupName(groups, longButValidName);

            expect(result.groupNameNotValid()).toBe(true);
        });
    });

    describe("combined validation scenarios", () => {
        it("should validate a completely new group with valid name", () => {
            const groups = [
                createMockGroup({ id: 1, name: "Healthcare" }),
                createMockGroup({ id: 2, name: "Education" }),
            ];
            const result = validateGroupName(groups, "Transportation");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });

        it("should reject duplicate name even if length is valid", () => {
            const groups = [createMockGroup({ id: 1, name: "Healthcare" })];
            const result = validateGroupName(groups, "Healthcare");

            expect(result.isUniqueName()).toBe(false);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(false);
        });

        it("should reject empty name even if unique", () => {
            const groups = [createMockGroup({ id: 1, name: "Healthcare" })];
            const result = validateGroupName(groups, "");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(false);
            expect(result.groupNameNotValid()).toBe(false);
        });

        it("should reject too long name even if unique", () => {
            const groups = [createMockGroup({ id: 1, name: "Healthcare" })];
            const tooLongName = "A".repeat(150);
            const result = validateGroupName(groups, tooLongName);

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(false);
            expect(result.groupNameNotValid()).toBe(false);
        });

        it("should handle validation with no existing groups", () => {
            const result = validateGroupName([], "First Group");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });

        it("should handle validation with undefined groups", () => {
            const result = validateGroupName(undefined, "New Group");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });
    });

    describe("edge cases", () => {
        it("should handle names with only whitespace characters", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "   ");

            expect(result.nameLengthIsValid()).toBe(true); // Length is > 0 and < 100
            expect(result.isUniqueName()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });

        it("should handle names with leading/trailing spaces", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, " Group B ");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });

        it("should not match group name with leading/trailing spaces against exact match", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, " Group A ");

            expect(result.isUniqueName()).toBe(true); // " Group A " !== "Group A"
        });

        it("should handle unicode characters in group names", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "Gruppe Ä");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });

        it("should handle emoji in group names", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "Group 🏥");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });

        it("should handle numbers in group names", () => {
            const groups = [createMockGroup({ id: 1, name: "Group 123" })];
            const result = validateGroupName(groups, "Group 456");

            expect(result.isUniqueName()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.groupNameNotValid()).toBe(true);
        });
    });

    describe("return value structure", () => {
        it("should return an object with three function properties", () => {
            const result = validateGroupName([], "Test");

            expect(result).toHaveProperty("isUniqueName");
            expect(result).toHaveProperty("nameLengthIsValid");
            expect(result).toHaveProperty("groupNameNotValid");
            expect(typeof result.isUniqueName).toBe("function");
            expect(typeof result.nameLengthIsValid).toBe("function");
            expect(typeof result.groupNameNotValid).toBe("function");
        });

        it("should allow calling validation functions multiple times", () => {
            const groups = [createMockGroup({ id: 1, name: "Group A" })];
            const result = validateGroupName(groups, "Group B");

            expect(result.isUniqueName()).toBe(true);
            expect(result.isUniqueName()).toBe(true); // Call again
            expect(result.nameLengthIsValid()).toBe(true);
            expect(result.nameLengthIsValid()).toBe(true); // Call again
        });
    });
});
