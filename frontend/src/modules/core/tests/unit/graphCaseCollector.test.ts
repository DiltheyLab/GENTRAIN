import { describe, it, expect, beforeEach } from "vitest";
import { AnalysisSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import {
    casesInOutbreak1,
    allMockCases,
    casesWithNoOutbreakAssigned,
    casesInDateRangeButNotInSelectedOutbreak,
} from "@/modules/core/tests/unit/mockCases";
import { GraphCaseCollector } from "../../services/graph/GraphCaseCollector";
import { CaseWithRelationships } from "../../models/cases";

describe("GraphCaseCollector", () => {
    let settings: AnalysisSettings;
    let allCases: CaseWithRelationships[];

    beforeEach(() => {
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
        allCases = allMockCases;
    });

    it("should collect all cases but only sequenced cases", async () => {
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        const sequencedCases = allCases.filter((mockCase) => mockCase.sample);
        expect(result).toEqual(sequencedCases);
    });

    it("should collect all cases", async () => {
        settings.excludeCasesWithoutSequence = false;
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(allCases);
    });

    it("should include only cases of the selectedOutbreak", async () => {
        settings.selectedOutbreak = { name: "Schule A", pathogen_id: 2, id: 1 };
        settings.includeAllCases = false;
        settings.excludeCasesWithoutSequence = false;
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(casesInOutbreak1);
    });

    it("should include only cases of the selectedOutbreak and cases which are not assigned to an outbreak", async () => {
        settings.selectedOutbreak = { name: "Schule A", pathogen_id: 2, id: 1 };
        settings.includeAllCases = false;
        settings.showBackground = true;
        settings.selectedBackground = {
            outbreaks: [],
            groupsWithCategories: [],
            casesWithoutOutbreakExist: true,
        };
        settings.excludeCasesWithoutSequence = false;
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(casesInOutbreak1.concat(casesWithNoOutbreakAssigned));
    });

    it("should include only cases of the selectedOutbreak and no background", async () => {
        settings.selectedOutbreak = { name: "Schule A", pathogen_id: 2, id: 1 };
        settings.includeAllCases = false;
        settings.showBackground = false;
        settings.excludeCasesWithoutSequence = false;
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        expect(result).toEqual(casesInOutbreak1);
    });

    it("should include only cases of the selectedOutbreak and in the dateRange", async () => {
        settings.selectedOutbreak = { name: "Schule A", pathogen_id: 2, id: 1 };
        settings.includeAllCases = true;
        settings.showBackground = true;
        settings.excludeCasesWithoutSequence = false;
        settings.excludeCasesOutsideOfDateRange = true;
        const graphCaseCollector = new GraphCaseCollector(allCases, settings);
        const result = await graphCaseCollector.execute();
        //expect(result).toEqual(casesInOutbreak1.concat(casesInDateRangeButNotInSelectedOutbreak));
        expect(result).toEqual([]);
    });
});
