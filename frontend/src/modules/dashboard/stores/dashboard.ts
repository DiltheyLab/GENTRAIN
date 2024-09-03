import { CustomNode, GraphData } from "@/modules/core/types/graph";
import { create } from "zustand";
import { addWeeks } from "date-fns";
import { AnalysisSettings, GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { useCoreStore } from "@/modules/core/stores/core";
import { CaseWithRelationships } from "@/modules/core/models/cases";

const defaultGraphSettings: GraphSettings = {
    showNodeLabel: false,
    nodeSize: 6,
    linkWidth: 3,
    colorMap: {},
    coloringMode: "outbreaks",
    charge: -80,
    linkDistance: 60,
};

export const getDefaultSettings = (): AnalysisSettings => {
    const geneticDistanceThreshold = useCoreStore.getState().activePathogen?.genetic_distance_threshold;

    return {
        includeAllCases: true,
        selectedOutbreak: null,
        datesOfCasesInSelectedOutbreak: [],
        selectedBackground: null,
        showBackground: true,
        excludeCasesAboveGeneticDistanceThreshold: false,
        excludeCasesOutsideOfDateRange: false,
        excludeCasesWithoutSequence: true,
        dateRange: { from: addWeeks(new Date(), -3), to: new Date() },
        geneticDistanceThreshold: geneticDistanceThreshold ?? 0,
        showContactTracingLinks: false,
        clusteringThreshold: geneticDistanceThreshold ?? 0,
    };
};

export interface DashboardStore {
    graphData: GraphData;
    settings: AnalysisSettings;
    graphSettings: GraphSettings;
    clusters: (CustomNode | undefined)[][] | undefined;
    updateClusters: (clusters: (CustomNode | undefined)[][]) => void;
    updateGraphData: (newGraphData: GraphData) => void;
    updateSettings: (newSettings: Partial<AnalysisSettings>) => void;
    updateGraphSettings: (newSettings: Partial<GraphSettings>) => void;
}
export const useDashboardStore = create<DashboardStore>((set) => {
    // Initialize the settings with the default settings and variables from add store
    const initializedSettings = getDefaultSettings();

    return {
        graphData: { nodes: [], links: [] },
        settings: initializedSettings,
        graphSettings: defaultGraphSettings,
        clusters: undefined,
        updateClusters: (clusters) => set({ clusters }),
        updateGraphData: (newGraphData) => set((state) => ({ graphData: { ...state.graphData, ...newGraphData } })),
        updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
        updateGraphSettings: (newGraphSettings) =>
            set((state) => ({ graphSettings: { ...state.graphSettings, ...newGraphSettings } })),
    };
});
