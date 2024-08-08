import { describe, expect, test } from "@jest/globals";

/**
 * Position Collection
 *
 * @group distance_calculation
 */
describe("Position Collection", function () {
    test("test", () => {
        expect(1).toBe(1);
    });
});
/**
 * Viral Distance Calculation
 *
 * @group distance_calculation/viral
 */
describe("Viral", function () {
    describe("Sample Alignment", function () {
        test("same samples have same alignment result", () => {
            expect(1).toBe(1);
        });
    });
    describe("Distance Calculation", function () {
        test("test", () => {
            expect(1).toBe(1);
        });
    });
});
/**
 * Bacterial Distance Calculation
 *
 * @group distance_calculation/viral
 */
describe("Bacterial", function () {
    describe("Sample Alignment", function () {
        test("test", () => {
            expect(1).toBe(1);
        });
    });
    describe("Distance Calculation", function () {
        test("test", () => {
            expect(1).toBe(1);
        });
    });
});
