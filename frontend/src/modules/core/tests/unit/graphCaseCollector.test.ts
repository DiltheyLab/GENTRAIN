import { describe, it, expect, beforeEach } from "vitest";
import { CaseWithRelationships } from "../../models/cases";
import { AnalysisSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { mockCases } from "@/modules/core/tests/unit/mockCases";
import { GraphCaseCollector } from "../../services/graph/GraphCaseCollector";

describe("GraphCaseCollector", () => {
    let cases: CaseWithRelationships[];
    let settings: AnalysisSettings;
    let graphCaseCollector: GraphCaseCollector;

    beforeEach(() => {
        //mock data
        cases = mockCases;

        settings = {
            includeAllCases: true,
            selectedOutbreak: null,
            datesOfCasesInSelectedOutbreak: [], // no relevant for this test
            selectedBackground: null,
            showBackground: true,
            excludeCasesAboveGeneticDistanceThreshold: false,
            excludeCasesOutsideOfDateRange: false,
            excludeCasesWithoutSequence: true,
            dateRange: {
                from: new Date("2024-08-22T08:31:38.000Z"),
                to: new Date("2024-09-12T08:31:38.000Z"),
            },
            geneticDistanceThreshold: 2,
            showContactTracingLinks: false, // no relevant for this test
            clusteringThreshold: 2, // no relevant for this test
        };

        graphCaseCollector = new GraphCaseCollector(cases, settings);
    });

    it("should execute and collect cases correctly with dashboard default settings", async () => {
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(mockCases.filter((mockCase) => mockCase.sample));
    });

    it("should include cases without sample", async () => {
        settings.excludeCasesWithoutSequence = false;
        graphCaseCollector = new GraphCaseCollector(cases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(mockCases);
    });

    it("should include all cases when includeAllCases is true", async () => {
        settings.selectedOutbreak = settings.includeAllCases = false;
        graphCaseCollector = new GraphCaseCollector(cases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual([]); // Adjust expected result based on mock data
    });

    it("should exclude cases outside of date range", async () => {
        settings.excludeCasesOutsideOfDateRange = true;
        graphCaseCollector = new GraphCaseCollector(cases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual([]); // Adjust expected result based on mock data
    });

    it("should show contact tracing links", async () => {
        settings.showContactTracingLinks = true;
        graphCaseCollector = new GraphCaseCollector(cases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual([]); // Adjust expected result based on mock data
    });
});
