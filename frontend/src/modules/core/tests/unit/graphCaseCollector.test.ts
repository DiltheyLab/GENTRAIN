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
            datesOfCasesInSelectedOutbreak: [],
            selectedBackground: null,
            showBackground: true,
            excludeCasesAboveGeneticDistanceThreshold: false,
            excludeCasesOutsideOfDateRange: false,
            excludeCasesWithoutSequence: true,
            dateRange: {
                from: new Date("2024-08-20T14:18:10.932Z"),
                to: new Date("2024-09-10T14:18:10.932Z"),
            },
            geneticDistanceThreshold: 2,
            showContactTracingLinks: false,
            clusteringThreshold: 2,
        };

        graphCaseCollector = new GraphCaseCollector(cases, settings);
    });

    it("should execute and collect cases correctly", async () => {
        const result = await graphCaseCollector.execute();
        expect(result).toEqual([]);
    });
});
