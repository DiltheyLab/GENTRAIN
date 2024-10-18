import { describe, it, expect, beforeEach, vi } from "vitest";
import { AnalysisSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { GraphCaseCollector } from "../../services/graph/GraphCaseCollector";
import { createCase } from "../entities/cases";
import { createSample } from "../entities/samples";
import { createDistance } from "../entities/distances";

describe("GraphCaseCollector", () => {
    let settings: AnalysisSettings;

    beforeEach(() => {
        // Set default settings
        settings = {
            backgroundType: "all",
            selectedOutbreak: null,
            datesOfCasesInSelectedOutbreak: [],
            selectedBackground: null,
            excludeCasesAboveGeneticDistanceThreshold: false,
            excludeCasesOutsideOfDateRange: false,
            excludeCasesWithoutSequence: true,
            dateRange: {
                from: new Date("2022-01-24T23:00:00.000Z"),
                to: new Date("2022-03-04T23:00:00.000Z"),
            },
            geneticDistanceThreshold: 2,
            showContactTracingLinks: false,
            clusteringThreshold: 2,
        };
    });

    it("should collect all sequenced cases", async () => {
        const outbreak1 = { id: 1, name: ":outbreakName1:" };
        const outbreak2 = { id: 2, name: ":outbreakName2:" };
        const outbreak3 = { id: 3, name: ":outbreakName3:" };

        const allCases = [
            createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id }),
            createCase({ id: 2, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 3, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 4, outbreak: outbreak2, outbreak_id: outbreak2.id }),
            createCase({ id: 5, outbreak: outbreak2, outbreak_id: outbreak2.id, sample: createSample({}) }),
            createCase({ id: 6, outbreak: outbreak3, outbreak_id: outbreak3.id }),
            createCase({ id: 7, outbreak: outbreak3, outbreak_id: outbreak3.id, sample: createSample({}) }),
            createCase({ id: 8 }),
            createCase({ id: 9, sample: createSample({}) }),
        ];

        settings.excludeCasesWithoutSequence = true;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([2, 3, 5, 7, 9]);
    });

    it("should collect all cases (even without sequence)", async () => {
        const allCases = [
            createCase({ id: 1 }),
            createCase({ id: 2, sample: createSample({}) }),
            createCase({ id: 3 }),
        ];

        settings.excludeCasesWithoutSequence = false;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(allCases);
    });

    it("should only include cases of the selected outbreak (with sample and without sample)", async () => {
        const outbreak1 = { id: 1, name: ":outbreakName1:" };
        const outbreak2 = { id: 2, name: ":outbreakName2:" };

        const allCases = [
            createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id }),
            createCase({ id: 2, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 3, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 4, outbreak: outbreak2, outbreak_id: outbreak2.id }),
            createCase({ id: 5, outbreak: outbreak2, outbreak_id: outbreak2.id, sample: createSample({}) }),
        ];

        settings.selectedOutbreak = outbreak1;
        settings.backgroundType = "none";
        settings.excludeCasesWithoutSequence = false;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([1, 2, 3]);
    });

    it("should only include cases with sample of the selectedOutbreak", async () => {
        const outbreak1 = { id: 1, name: ":outbreakName1:" };
        const outbreak2 = { id: 2, name: ":outbreakName2:" };

        const allCases = [
            createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id }),
            createCase({ id: 2, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 3, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 4, outbreak: outbreak2, outbreak_id: outbreak2.id }),
            createCase({ id: 5, outbreak: outbreak2, outbreak_id: outbreak2.id, sample: createSample({}) }),
        ];

        settings.selectedOutbreak = outbreak1;
        settings.backgroundType = "none";
        settings.excludeCasesWithoutSequence = true;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([2, 3]);
    });

    it("should only include cases of the selected outbreak and cases which are not assigned to an outbreak", async () => {
        const outbreak1 = { id: 1, name: ":outbreakName1:" };
        const outbreak2 = { id: 2, name: ":outbreakName2:" };

        const allCases = [
            createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id }),
            createCase({ id: 2, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 3, outbreak: outbreak2, outbreak_id: outbreak2.id, sample: createSample({}) }),
            createCase({ id: 4 }),
            createCase({ id: 5, sample: createSample({}) }),
        ];

        settings.selectedOutbreak = outbreak1;
        settings.backgroundType = "specific";
        settings.selectedBackground = {
            outbreaks: [],
            groupsWithCategories: [],
            casesWithoutOutbreakExist: true,
        };
        settings.excludeCasesWithoutSequence = true;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([2, 5]);
    });

    it("should only include cases of the selected outbreak and which are in a specific outbreak", async () => {
        const outbreak1 = { id: 1, name: ":outbreakName1:" };
        const outbreak2 = { id: 2, name: ":outbreakName2:" };
        const outbreak3 = { id: 3, name: ":outbreakName2:" };

        const allCases = [
            createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id }),
            createCase({ id: 2, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 3, outbreak: outbreak2, outbreak_id: outbreak2.id, sample: createSample({}) }),
            createCase({ id: 4 }),
            createCase({ id: 5, sample: createSample({}) }),
            createCase({ id: 6, outbreak: outbreak3, outbreak_id: outbreak3.id }),
        ];

        settings.selectedOutbreak = outbreak1;
        settings.backgroundType = "specific";
        settings.excludeCasesWithoutSequence = true; // don't allow unsequenced cases in the result
        settings.selectedBackground = {
            outbreaks: [outbreak2],
            groupsWithCategories: [],
            casesWithoutOutbreakExist: false,
        };

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([2, 3]);
    });

    it("should only include cases of the selected outbreak and which are in a specific group", async () => {
        const outbreak1 = { id: 1, name: ":outbreakName1:" };
        const outbreak2 = { id: 2, name: ":outbreakName2:" };
        const group1 = {
            id: 1,
            category_id: 0,
            categoryName: ":category_name:",
            name: ":group_name:",
        };
        const allCases = [
            createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id }),
            createCase({ id: 2, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 3, outbreak: outbreak2, outbreak_id: outbreak2.id, sample: createSample({}) }),
            createCase({ id: 4 }),
            createCase({ id: 5, sample: createSample({}) }),
            createCase({ id: 6, group_ids: [group1.id], sample: createSample({}) }),
        ];

        settings.selectedOutbreak = outbreak1;
        settings.backgroundType = "specific";
        settings.excludeCasesWithoutSequence = true; // don't allow unsequenced cases in the result
        settings.selectedBackground = {
            outbreaks: [outbreak2],
            groupsWithCategories: [group1],
            casesWithoutOutbreakExist: false,
        };

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([2, 3, 6]);
    });

    it("should only include cases in the dateRange", async () => {
        const caseInDateRange1 = createCase({ id: 1, registered_at: new Date("2022-02-06T23:00:00.000Z") });
        const caseInDateRange2 = createCase({ id: 2, registered_at: new Date("2022-02-08T23:00:00.000Z") });
        const caseNotInDateRange3 = createCase({ id: 3, registered_at: new Date("2022-02-03T23:00:00.000Z") });
        const caseNotInDateRange4 = createCase({ id: 4, registered_at: new Date("2022-03-05T23:00:00.000Z") });

        settings.dateRange = {
            from: new Date("2022-02-05T23:00:00.000Z"),
            to: new Date("2022-03-04T23:00:00.000Z"),
        };

        settings.selectedOutbreak = { id: 1, name: ":outbreakName1:" };
        settings.excludeCasesOutsideOfDateRange = true;
        settings.excludeCasesWithoutSequence = false;

        const graphCaseCollector = new GraphCaseCollector(
            [caseInDateRange1, caseInDateRange2, caseNotInDateRange3, caseNotInDateRange4],
            settings
        );
        const result = await graphCaseCollector.execute();
        expect(result).toEqual([caseInDateRange1, caseInDateRange2]);
    });

    it("should only include cases of the selectedOutbreak and cases below the genetic distance threshold", async () => {
        const outbreak1 = { id: 1, name: ":outbreakName1:" };
        const outbreak2 = { id: 2, name: ":outbreakName2:" };

        const allCases = [
            createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({ id: 1 }) }),
            createCase({ id: 2, outbreak: outbreak1, outbreak_id: outbreak1.id, sample: createSample({}) }),
            createCase({ id: 3, outbreak: outbreak2, outbreak_id: outbreak2.id, sample: createSample({ id: 2 }) }),
        ];

        // mocks the function which access the indexedDB
        vi.mock("@/modules/core/models/distances", () => ({
            getDistancesFromSampleIdsBelowThreshold: vi.fn().mockImplementation(() => {
                //create mock distance
                const distance1 = createDistance({ sample_id_1: 1, sample_id_2: 2 });
                return [distance1];
            }),
        }));

        settings.selectedOutbreak = outbreak1;
        settings.excludeCasesWithoutSequence = true;
        settings.geneticDistanceThreshold = 3;
        settings.excludeCasesAboveGeneticDistanceThreshold = true;
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([1, 2, 3]);
    });
});
