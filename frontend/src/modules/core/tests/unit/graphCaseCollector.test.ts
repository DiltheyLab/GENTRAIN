import { describe, it, expect, beforeEach, vi } from "vitest";
import { AnalysisSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { GraphCaseCollector } from "../../services/graph/GraphCaseCollector";
import { CaseWithRelationships } from "../../models/cases";
import { createCase } from "../entities/cases";
import { createSample } from "../entities/samples";
import { OutbreakSchema } from "../../models/outbreaks";
import { createDistance } from "../entities/distances";

describe("GraphCaseCollector", () => {
    let settings: AnalysisSettings;
    let allCases: CaseWithRelationships[];
    let caseInOutbreak1WithoutSample: CaseWithRelationships;
    let caseInOutbreak1WithSample2: CaseWithRelationships;
    let caseInOutbreak1WithSample: CaseWithRelationships;
    let caseInOutbreak2WithoutSample: CaseWithRelationships;
    let caseInOutbreak2WithSample: CaseWithRelationships;
    let caseInOutbreak3WithoutSample: CaseWithRelationships;
    let caseInOutbreak3WithSample: CaseWithRelationships;
    let caseWithoutOutbreakAndWithoutSample: CaseWithRelationships;
    let caseWithoutOutbreakWithSample: CaseWithRelationships;
    let outbreak1: OutbreakSchema;
    let outbreak2: OutbreakSchema;
    let outbreak3: OutbreakSchema;

    beforeEach(() => {
        // set default outbreaks
        outbreak1 = { name: ":outbreakName1:", pathogen_id: undefined, id: 1 };
        outbreak2 = { name: ":outbreakName2:", pathogen_id: undefined, id: 2 };
        outbreak3 = { name: ":outbreakName3:", pathogen_id: undefined, id: 3 };

        // set default cases
        caseInOutbreak1WithoutSample = createCase({ id: 1, outbreak: outbreak1, outbreak_id: outbreak1.id });
        caseInOutbreak1WithSample = createCase({
            id: 2,
            outbreak: outbreak1,
            outbreak_id: outbreak1.id,
            sample: createSample({}),
        });
        caseInOutbreak1WithSample2 = createCase({
            id: 3,
            outbreak: outbreak1,
            outbreak_id: outbreak1.id,
            sample: createSample({}),
        });
        caseInOutbreak2WithoutSample = createCase({ id: 4, outbreak: outbreak2, outbreak_id: outbreak2.id });
        caseInOutbreak2WithSample = createCase({
            id: 5,
            outbreak: outbreak2,
            outbreak_id: outbreak2.id,
            sample: createSample({}),
        });
        caseInOutbreak3WithoutSample = createCase({ id: 6, outbreak: outbreak3, outbreak_id: outbreak3.id });
        caseInOutbreak3WithSample = createCase({
            id: 7,
            outbreak: outbreak3,
            outbreak_id: outbreak3.id,
            sample: createSample({}),
        });
        caseWithoutOutbreakAndWithoutSample = createCase({ id: 8 });
        caseWithoutOutbreakWithSample = createCase({ id: 9, sample: createSample({}) });
        allCases = [
            caseInOutbreak1WithoutSample,
            caseInOutbreak1WithSample,
            caseInOutbreak1WithSample2,
            caseInOutbreak2WithoutSample,
            caseInOutbreak2WithSample,
            caseInOutbreak3WithoutSample,
            caseInOutbreak3WithSample,
            caseWithoutOutbreakAndWithoutSample,
            caseWithoutOutbreakWithSample,
        ];

        // set default settings
        settings = {
            includeAllCases: true,
            selectedOutbreak: null,
            datesOfCasesInSelectedOutbreak: [], // not relevant for this test
            selectedBackground: null,
            showBackground: true,
            excludeCasesAboveGeneticDistanceThreshold: false,
            excludeCasesOutsideOfDateRange: false,
            excludeCasesWithoutSequence: true,
            dateRange: {
                from: new Date("2022-01-24T23:00:00.000Z"),
                to: new Date("2022-03-04T23:00:00.000Z"),
            },
            geneticDistanceThreshold: 2,
            showContactTracingLinks: false, // not relevant for this test
            clusteringThreshold: 2, // not relevant for this test
        };
    });

    it("should collect all sequenced cases", async () => {
        settings.excludeCasesWithoutSequence = true;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([
            caseInOutbreak1WithSample.id,
            caseInOutbreak1WithSample2.id,
            caseInOutbreak2WithSample.id,
            caseInOutbreak3WithSample.id,
            caseWithoutOutbreakWithSample.id,
        ]);
    });

    it("should collect all cases", async () => {
        settings.excludeCasesWithoutSequence = false;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(allCases);
    });

    it("should only include cases of the selectedOutbreak (with sample and without sample)", async () => {
        settings.selectedOutbreak = outbreak1;
        settings.includeAllCases = false;
        settings.excludeCasesWithoutSequence = false;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([
            caseInOutbreak1WithoutSample.id,
            caseInOutbreak1WithSample.id,
            caseInOutbreak1WithSample2.id,
        ]);
    });

    it("should only include cases with sample of the selectedOutbreak", async () => {
        settings.selectedOutbreak = outbreak1;
        settings.includeAllCases = false;
        settings.excludeCasesWithoutSequence = true;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([caseInOutbreak1WithSample.id, caseInOutbreak1WithSample2.id]);
    });

    it("should only include cases of the selectedOutbreak and cases which are not assigned to an outbreak", async () => {
        settings.selectedOutbreak = outbreak1;
        settings.includeAllCases = false;
        settings.showBackground = true;
        settings.selectedBackground = {
            outbreaks: [],
            groupsWithCategories: [],
            casesWithoutOutbreakExist: true,
        };
        settings.excludeCasesWithoutSequence = true;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([
            caseInOutbreak1WithSample.id,
            caseInOutbreak1WithSample2.id,
            caseWithoutOutbreakWithSample.id,
        ]);
    });

    it("should only include cases of the selectedOutbreak and no background", async () => {
        settings.selectedOutbreak = outbreak1;
        settings.includeAllCases = false;
        settings.showBackground = false;
        settings.excludeCasesWithoutSequence = false;
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([
            caseInOutbreak1WithoutSample.id,
            caseInOutbreak1WithSample.id,
            caseInOutbreak1WithSample2.id,
        ]);
    });

    it("should only include cases of the selectedOutbreak and cases in the dateRange", async () => {
        caseInOutbreak1WithSample.registered_at = new Date("2022-02-04T23:00:00.000Z"); // not inside date rangebut should be included because of the outbreak
        caseInOutbreak1WithoutSample.registered_at = new Date("2022-02-05T23:00:00.000Z"); // inside date range
        caseInOutbreak2WithoutSample.registered_at = new Date("2022-02-01T23:00:00.000Z"); // not inside date range
        caseInOutbreak3WithoutSample.registered_at = new Date("2022-03-05T23:00:00.000Z"); // not inside date range
        caseWithoutOutbreakAndWithoutSample.registered_at = new Date("2022-03-04T22:59:00.000Z"); // inside date range
        caseWithoutOutbreakWithSample.registered_at = new Date("2022-02-01T23:00:00.000Z"); // not inside date range

        settings.dateRange = {
            from: new Date("2022-02-05T23:00:00.000Z"),
            to: new Date("2022-03-04T23:00:00.000Z"),
        };

        settings.selectedOutbreak = outbreak1;
        settings.excludeCasesOutsideOfDateRange = true;
        settings.excludeCasesWithoutSequence = false;

        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = (await graphCaseCollector.execute()).map((c) => c.id);
        expect(result).toEqual([
            caseInOutbreak1WithoutSample.id,
            caseInOutbreak1WithSample.id,
            caseInOutbreak1WithSample2.id,
            caseWithoutOutbreakAndWithoutSample.id,
        ]);
    });

    it("should only include cases of the selectedOutbreak and cases below the genetic distance threshold", async () => {
        caseInOutbreak1WithSample.sample!.id = 1;
        caseInOutbreak2WithSample.sample!.id = 2;

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
        expect(result).toEqual([
            caseInOutbreak1WithSample.id, //included because in outbreak
            caseInOutbreak1WithSample2.id, //included because in outbreak
            caseInOutbreak2WithSample.id, //included because distance below threshold
        ]);
    });
});
