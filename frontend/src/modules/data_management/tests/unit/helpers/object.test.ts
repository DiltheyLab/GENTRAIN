import { describe, it, expect } from "vitest";
import { groupBy } from "@/modules/data_management/helpers/object";

describe("groupBy", () => {
    describe("basic functionality", () => {
        it("should group objects by a simple string key", () => {
            const data = [
                { id: 1, category: "fruit", name: "apple" },
                { id: 2, category: "vegetable", name: "carrot" },
                { id: 3, category: "fruit", name: "banana" },
            ];

            const result = groupBy(data, "category");

            expect(result).toEqual({
                fruit: [
                    { id: 1, category: "fruit", name: "apple" },
                    { id: 3, category: "fruit", name: "banana" },
                ],
                vegetable: [{ id: 2, category: "vegetable", name: "carrot" }],
            });
        });

        it("should group objects by a numeric key", () => {
            const data = [
                { id: 1, age: 25, name: "Alice" },
                { id: 2, age: 30, name: "Bob" },
                { id: 3, age: 25, name: "Charlie" },
            ];

            const result = groupBy(data, "age");

            expect(result).toEqual({
                25: [
                    { id: 1, age: 25, name: "Alice" },
                    { id: 3, age: 25, name: "Charlie" },
                ],
                30: [{ id: 2, age: 30, name: "Bob" }],
            });
        });

        it("should handle single item arrays", () => {
            const data = [{ id: 1, type: "admin", name: "User1" }];

            const result = groupBy(data, "type");

            expect(result).toEqual({
                admin: [{ id: 1, type: "admin", name: "User1" }],
            });
        });

        it("should handle empty arrays", () => {
            const data: any[] = [];

            const result = groupBy(data, "type");

            expect(result).toEqual({});
        });
    });

    describe("grouping with multiple items per group", () => {
        it("should group multiple objects under the same key", () => {
            const data = [
                { id: 1, status: "active" },
                { id: 2, status: "active" },
                { id: 3, status: "active" },
                { id: 4, status: "inactive" },
            ];

            const result = groupBy(data, "status");

            expect(result.active).toHaveLength(3);
            expect(result.inactive).toHaveLength(1);
        });

        it("should preserve order within groups", () => {
            const data = [
                { id: 1, category: "A", order: 1 },
                { id: 2, category: "B", order: 2 },
                { id: 3, category: "A", order: 3 },
                { id: 4, category: "A", order: 4 },
            ];

            const result = groupBy(data, "category");

            expect(result.A[0].order).toBe(1);
            expect(result.A[1].order).toBe(3);
            expect(result.A[2].order).toBe(4);
        });
    });

    describe("edge cases", () => {
        it("should handle objects with null values as keys", () => {
            const data = [
                { id: 1, category: null, name: "item1" },
                { id: 2, category: "valid", name: "item2" },
                { id: 3, category: null, name: "item3" },
            ];

            const result = groupBy(data, "category");

            expect(result.null).toHaveLength(2);
            expect(result.valid).toHaveLength(1);
        });

        it("should handle objects with undefined values as keys", () => {
            const data = [
                { id: 1, category: undefined, name: "item1" },
                { id: 2, category: "valid", name: "item2" },
            ];

            const result = groupBy(data, "category");

            expect(result.undefined).toHaveLength(1);
            expect(result.valid).toHaveLength(1);
        });

        it("should handle boolean values as keys", () => {
            const data = [
                { id: 1, isActive: true, name: "Active1" },
                { id: 2, isActive: false, name: "Inactive1" },
                { id: 3, isActive: true, name: "Active2" },
            ];

            const result = groupBy(data, "isActive");

            expect(result.true).toHaveLength(2);
            expect(result.false).toHaveLength(1);
        });

        it("should handle zero as a key value", () => {
            const data = [
                { id: 1, count: 0, name: "Zero1" },
                { id: 2, count: 1, name: "One1" },
                { id: 3, count: 0, name: "Zero2" },
            ];

            const result = groupBy(data, "count");

            expect(result[0]).toHaveLength(2);
            expect(result[1]).toHaveLength(1);
        });

        it("should handle empty string as a key value", () => {
            const data = [
                { id: 1, category: "", name: "Empty1" },
                { id: 2, category: "filled", name: "Filled1" },
                { id: 3, category: "", name: "Empty2" },
            ];

            const result = groupBy(data, "category");

            expect(result[""]).toHaveLength(2);
            expect(result.filled).toHaveLength(1);
        });

        it("should handle objects where the key does not exist", () => {
            const data = [
                { id: 1, name: "Item1" },
                { id: 2, category: "exists", name: "Item2" },
            ];

            const result = groupBy(data, "category");

            expect(result.undefined).toHaveLength(1);
            expect(result.exists).toHaveLength(1);
        });
    });

    describe("complex data structures", () => {
        it("should group objects with nested properties", () => {
            const data = [
                { id: 1, type: "user", meta: { role: "admin" } },
                { id: 2, type: "post", meta: { role: "user" } },
                { id: 3, type: "user", meta: { role: "admin" } },
            ];

            const result = groupBy(data, "type");

            expect(result.user).toHaveLength(2);
            expect(result.post).toHaveLength(1);
        });

        it("should group objects with array properties", () => {
            const data = [
                { id: 1, status: "active", tags: ["important", "urgent"] },
                { id: 2, status: "inactive", tags: ["archived"] },
                { id: 3, status: "active", tags: ["review"] },
            ];

            const result = groupBy(data, "status");

            expect(result.active).toHaveLength(2);
            expect(result.inactive).toHaveLength(1);
            expect(result.active[0].tags).toEqual(["important", "urgent"]);
        });

        it("should preserve all object properties in grouped items", () => {
            const data = [
                { id: 1, type: "A", name: "Item1", description: "Desc1", metadata: { key: "value" } },
                { id: 2, type: "A", name: "Item2", description: "Desc2", metadata: { key: "value2" } },
            ];

            const result = groupBy(data, "type");

            expect(result.A[0]).toEqual({
                id: 1,
                type: "A",
                name: "Item1",
                description: "Desc1",
                metadata: { key: "value" },
            });
        });
    });

    describe("special characters in keys", () => {
        it("should handle keys with spaces", () => {
            const data = [
                { id: 1, "user type": "admin" },
                { id: 2, "user type": "guest" },
            ];

            const result = groupBy(data, "user type");

            expect(result.admin).toHaveLength(1);
            expect(result.guest).toHaveLength(1);
        });

        it("should handle keys with special characters", () => {
            const data = [
                { id: 1, category: "type-A", name: "Item1" },
                { id: 2, category: "type_B", name: "Item2" },
                { id: 3, category: "type-A", name: "Item3" },
            ];

            const result = groupBy(data, "category");

            expect(result["type-A"]).toHaveLength(2);
            expect(result["type_B"]).toHaveLength(1);
        });
    });

    describe("return value", () => {
        it("should return a new object without mutating the input", () => {
            const data = [
                { id: 1, category: "A" },
                { id: 2, category: "B" },
            ];

            const originalLength = data.length;
            const result = groupBy(data, "category");

            expect(data.length).toBe(originalLength);
            expect(result).not.toBe(data);
        });

        it("should return an object with arrays as values", () => {
            const data = [
                { id: 1, type: "X" },
                { id: 2, type: "Y" },
            ];

            const result = groupBy(data, "type");

            expect(Array.isArray(result.X)).toBe(true);
            expect(Array.isArray(result.Y)).toBe(true);
        });
    });

    describe("real-world scenarios", () => {
        it("should group cases by pathogen type", () => {
            const cases = [
                { case_id: "C1", pathogen_type: "viral", name: "Case1" },
                { case_id: "C2", pathogen_type: "bacterial", name: "Case2" },
                { case_id: "C3", pathogen_type: "viral", name: "Case3" },
                { case_id: "C4", pathogen_type: "bacterial", name: "Case4" },
            ];

            const result = groupBy(cases, "pathogen_type");

            expect(result.viral).toHaveLength(2);
            expect(result.bacterial).toHaveLength(2);
        });

        it("should group users by role", () => {
            const users = [
                { id: 1, name: "Alice", role: "admin" },
                { id: 2, name: "Bob", role: "user" },
                { id: 3, name: "Charlie", role: "admin" },
                { id: 4, name: "David", role: "moderator" },
            ];

            const result = groupBy(users, "role");

            expect(Object.keys(result)).toEqual(["admin", "user", "moderator"]);
            expect(result.admin).toHaveLength(2);
        });

        it("should group data by date strings", () => {
            const events = [
                { id: 1, date: "2025-01-01", event: "Event1" },
                { id: 2, date: "2025-01-02", event: "Event2" },
                { id: 3, date: "2025-01-01", event: "Event3" },
            ];

            const result = groupBy(events, "date");

            expect(result["2025-01-01"]).toHaveLength(2);
            expect(result["2025-01-02"]).toHaveLength(1);
        });

        it("should group sequences by analysis status", () => {
            const sequences = [
                { id: 1, fasta_id: "SEQ1", status: "completed" },
                { id: 2, fasta_id: "SEQ2", status: "pending" },
                { id: 3, fasta_id: "SEQ3", status: "completed" },
                { id: 4, fasta_id: "SEQ4", status: "failed" },
            ];

            const result = groupBy(sequences, "status");

            expect(result.completed).toHaveLength(2);
            expect(result.pending).toHaveLength(1);
            expect(result.failed).toHaveLength(1);
        });
    });
});
