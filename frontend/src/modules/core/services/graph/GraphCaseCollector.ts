import { AnalysisSettings, SelectedBackground } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { DateRange } from "react-day-picker";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { getDistancesFromCaseIdsBelowThreshold } from "@/modules/core/models/distances";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";

/**
 * GraphCaseCollector is responsible for collecting cases based on the provided settings.
 * It filters cases based on the selected outbreak, background, genetic distance threshold,
 * and other criteria, and returns the cases that should be included in the graph.
 * This class is used to prepare the data for the graph visualization in outbreak analysis.
 * @class GraphCaseCollector
 * @property {CaseWithRelationships[]} casesInGraph - The cases that should be included in the graph.
 * @property {CaseWithRelationships[]} casesInOutbreak - The cases that are part of the selected outbreak.
 * @property {CaseWithRelationships[]} cases - The original cases provided to the collector.
 * @property {AnalysisSettings} settings - The settings used to filter and collect cases.
 * @constructor
 * @param {CaseWithRelationships[]} cases - The original cases to be filtered and collected.
 * @param {AnalysisSettings} settings - The settings used to filter and collect cases.
 * @example
 * const collector = new GraphCaseCollector(cases, settings);
 * collector.execute().then((casesInGraph) => {
 *     // Use the casesInGraph for graph visualization
 *  });
 */
export class GraphCaseCollector {
    private casesInGraph: CaseWithRelationships[];
    private casesInOutbreak: CaseWithRelationships[];
    private cases: CaseWithRelationships[];
    private settings: AnalysisSettings;

    constructor(cases: CaseWithRelationships[], settings: AnalysisSettings) {
        this.cases = cases;
        this.settings = settings;
        this.casesInGraph = [];
        this.casesInOutbreak = [];
    }

    /**
     * Executes the case collection process based on the provided settings.
     * It filters cases based on the selected outbreak, background, genetic distance threshold,
     * and other criteria, and returns the cases that should be included in the graph.
     *
     * @returns An array of cases that should be included in the graph.
     */
    execute = async () => {
        const {
            selectedOutbreak,
            selectedBackground,
            geneticDistanceThreshold,
            excludeCasesAboveGeneticDistanceThreshold,
            excludeCasesWithoutSequence,
            backgroundType,
            excludeCasesOutsideOfDateRange,
            dateRange,
        } = this.settings;
        // *************************** SELECT OUTBREAK ********************************

        // get cases from outbreak and add them to the casesInGraph and casesInOutbreak array for later use
        if (selectedOutbreak) {
            this.addCasesFromOutbreak(selectedOutbreak);
        }
        // *************************** SELECT BACKGROUND ********************************

        // use all cases without any filtering for the graph
        if (backgroundType === "all") {
            this.addAllCases();
        }

        // use cases which are selected in the multiselect field
        if (selectedBackground && backgroundType === "specific") {
            this.addCasesFromBackground(selectedBackground);
        }

        // *************************** FILTERING ********************************

        // filter cases which have no sequence
        if (excludeCasesWithoutSequence) {
            this.removeCasesWithoutSequenceAnalysis();
        }

        // filter cases which have a distance above the genetic distance threshold
        if (excludeCasesAboveGeneticDistanceThreshold && selectedOutbreak) {
            // get cases with genetic distance below threshold which are connected to a case in the selected outbreak
            await this.removeCasesBelowGeneticDistanceThreshold(selectedOutbreak, geneticDistanceThreshold);
        }

        // filter out cases which are not in the selected time range
        if (excludeCasesOutsideOfDateRange && dateRange) {
            this.removeCasesOutsideOfDateRange(dateRange);
        }

        // the casesInGraph array contains duplicated cases. Example: A case is in a selected
        // group and in background (not outbreak). The cases is added twice to the casesInGraph array.
        // to prevent rendering the same case multiple times we filter out duplicates in the end instead of
        // checking for duplicates in each filter step
        this.removeDuplicateCases();

        return this.casesInGraph;
    };

    private filterCasesByOutbreak = (selectedOutbreak: OutbreakSchema) => {
        return this.cases.filter((caseData) => caseData.outbreak_id === selectedOutbreak.id);
    };

    private filterCasesByGroupsAndOutbreaks = (selectedBackground: SelectedBackground) => {
        return this.cases.filter(
            (caseData) =>
                selectedBackground.outbreaks.some((outbreak) => caseData.outbreak_id === outbreak.id) || //include cases from selected outbreaks
                selectedBackground.groupsWithCategories.some((group) => caseData.group_ids.includes(group.id)) || //include cases from selected groups
                (selectedBackground.casesWithoutOutbreakExist && caseData.outbreak_id === null) //include cases without outbreak
        );
    };

    /**
     * Filters cases in the graph by genetic distance threshold.
     * It retrieves cases that are connected to the selected outbreak and have a genetic distance below the threshold.
     * Therefore following steps are performed:
     * 1. Get all cases IDs the selected outbreak.
     * 2. Get all distances between cases in the selected outbreak and other cases that are below the genetic distance threshold.
     * 3. Extract case IDs from the distances.
     * 4. Filter cases in the graph by the extracted case IDs.
     *
     * @param selectedOutbreak - The outbreak to filter cases by.
     * @param geneticDistanceThreshold - The genetic distance threshold to filter cases by.
     * @returns An array of cases in the graph with genetic distance below genetic threshold.
     */
    private filterCasesByGeneticDistanceThreshold = async (
        selectedOutbreak: OutbreakSchema,
        geneticDistanceThreshold: number
    ) => {
        const casesOfSelectedOutbreak = this.filterCasesByOutbreak(selectedOutbreak);

        const caseIdsInSelectedOutbreak = casesOfSelectedOutbreak.map((caseData) => caseData.id);

        const distancesBelowThreshold = await getDistancesFromCaseIdsBelowThreshold(
            caseIdsInSelectedOutbreak,
            geneticDistanceThreshold
        );

        const caseIdsBelowThreshold = distancesBelowThreshold.reduce((acc, distance) => {
            acc.push(distance.case_id_1, distance.case_id_2);
            return acc;
        }, [] as number[]);

        const caseIdsWithoutDuplicates = Array.from(new Set(caseIdsBelowThreshold));

        const casesInGraphWithGeneticDistanceBelowThreshold = this.casesInGraph.filter((caseData) =>
            caseIdsWithoutDuplicates.includes(caseData.id)
        );

        return casesInGraphWithGeneticDistanceBelowThreshold;
    };

    /**
     * Filters cases in the graph by date range.
     * It retrieves cases that were registered within the specified date range.
     *
     * @param dateRange - The date range to filter cases by.
     * @returns An array of cases in the graph that were registered within the date range.
     */
    private filterCasesInGraphByDateRange = (dateRange: DateRange) => {
        return this.casesInGraph.filter((caseData) => {
            const caseWasRegisteredAt = caseData.registered_at.getTime();
            const startDate = dateRange.from?.getTime() ?? 0;
            const endDate = dateRange.to?.getTime() ?? dateRange.from?.getTime() ?? Infinity;
            return caseWasRegisteredAt >= startDate && caseWasRegisteredAt <= endDate;
        });
    };

    private filterCasesWithoutSequenceAnalysis = (cases: CaseWithRelationships[]) => {
        return cases.filter((caseData) => caseData.sequence_analysis?.result);
    };

    private removeDuplicateCases() {
        this.casesInGraph = this.casesInGraph.filter((caseData, index, self) => {
            return index === self.findIndex((t) => t.id === caseData.id);
        });
    }

    private removeCasesOutsideOfDateRange(dateRange: DateRange) {
        const casesFilteredByDateRange = this.filterCasesInGraphByDateRange(dateRange);
        // add cases in date range to the cases in the outbreak
        this.casesInGraph = this.casesInOutbreak.concat(casesFilteredByDateRange);
    }

    private async removeCasesBelowGeneticDistanceThreshold(
        selectedOutbreak: OutbreakSchema,
        geneticDistanceThreshold: number
    ) {
        // get cases in graph with low genetic distance
        // which are connected to a case in the selected outbreak
        const casesInGraphWithLowGeneticDistance = await this.filterCasesByGeneticDistanceThreshold(
            selectedOutbreak,
            geneticDistanceThreshold
        );

        // get cases without sequence data which are left in casesInGraph
        const casesWithoutSequence = this.casesInGraph.filter((caseData) => !caseData.sequence_analysis);

        // add cases with low genetic distance to the cases in the outbreak
        this.casesInGraph = this.casesInOutbreak.concat(casesInGraphWithLowGeneticDistance);

        // add cases without sequence data in the end because they were filtered out by filterCasesByGeneticDistanceThreshold
        // we want to keep them in the graph
        this.casesInGraph = this.casesInGraph.concat(casesWithoutSequence);
    }

    private removeCasesWithoutSequenceAnalysis() {
        this.casesInGraph = this.filterCasesWithoutSequenceAnalysis(this.casesInGraph);
        this.casesInOutbreak = this.filterCasesWithoutSequenceAnalysis(this.casesInOutbreak);
    }

    private addCasesFromBackground(selectedBackground: SelectedBackground) {
        const filteredCasesByBackground = this.filterCasesByGroupsAndOutbreaks(selectedBackground);
        // add cases from background to cases in graph
        this.casesInGraph = this.casesInGraph.concat(filteredCasesByBackground);
    }

    private addCasesFromOutbreak(selectedOutbreak: OutbreakSchema) {
        this.casesInGraph = this.filterCasesByOutbreak(selectedOutbreak);
        this.casesInOutbreak = [...this.casesInGraph];
    }

    private addAllCases() {
        this.casesInGraph = [...this.cases];
    }
}
