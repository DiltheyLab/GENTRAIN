import { CustomNode, GraphData } from "@/modules/core/types/graph";
import { create } from "zustand";
import { addWeeks } from "date-fns";
import { AnalysisSettings, GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { useCoreStore } from "@/modules/core/stores/core";

export const defaultGraphSettings: GraphSettings = {
    showNodeLabel: false,
    nodeSize: 6,
    linkWidth: 3,
    colorMap: {},
    coloringMode: "outbreaks",
    charge: -80,
    linkDistance: 60,
    zoomToFitToggle: false,
};

export const getDefaultSettings = (): AnalysisSettings => {
    const geneticDistanceThreshold = useCoreStore.getState().activePathogen?.genetic_distance_threshold;

    return {
        backgroundType: "all",
        selectedOutbreak: null,
        datesOfCasesInSelectedOutbreak: [],
        selectedBackground: null,
        excludeCasesAboveGeneticDistanceThreshold: false,
        excludeCasesOutsideOfDateRange: false,
        excludeCasesWithoutSequence: false,
        dateRange: { from: addWeeks(new Date(), -3), to: new Date() },
        geneticDistanceThreshold: geneticDistanceThreshold ?? 0,
        showContactTracingLinks: true,
        clusteringThreshold: geneticDistanceThreshold ?? 0,
    };
};

type DashboardStoreState = {
    graphData: GraphData;
    settings: AnalysisSettings;
    graphSettings: GraphSettings;
    clusters: (CustomNode | undefined)[][] | undefined;
};

type DashboardStoreActions = {
    updateClusters: (clusters: (CustomNode | undefined)[][]) => void;
    updateGraphData: (newGraphData: GraphData) => void;
    updateSettings: (newSettings: Partial<AnalysisSettings>) => void;
    updateGraphSettings: (newSettings: Partial<GraphSettings>) => void;
};

type DashboardStore = DashboardStoreState & DashboardStoreActions;

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
