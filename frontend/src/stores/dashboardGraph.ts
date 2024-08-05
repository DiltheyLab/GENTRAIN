import { GraphData } from "@/types/graph";
import { create } from "zustand";
import { AnalysisSettings, GraphSettings } from "./analysis";
import { useAppStore } from "./app";
import { addWeeks } from "date-fns";
import { COLORPALETTENODES } from "@/colors/colorPaletteNodes";

const defaultGraphSettings: GraphSettings = {
    graphDimension: "2D",
    showNodeLabel: true,
    nodeSize: 6,
    linkWidth: 3,
    zoomToFit: false,
    charge: -50,
    linkDistance: 50,
    coloring: "normal",
};

export const getDefaultSettings = (): AnalysisSettings => {
    const relationshipThreshold = useAppStore.getState().activePathogen?.relationship_threshold;
    return {
        includeAllCases: true,
        selectedOutbreak: null,
        datesOfCasesInSelectedOutbreak: [],
        selectedBackground: null,
        showBackground: true,
        includeCasesWithLowGeneticDistance: false,
        excludeCasesOutsideOfDateRange: false,
        dateRange: { from: addWeeks(new Date(), -3), to: new Date() },
        geneticDistanceThreshold: relationshipThreshold ?? 0,
        showContactTracingEdges: false,
        hideEdgesAboveThreshold: false,
        groupColorations: [],
        colorPaletteNodes: COLORPALETTENODES,
        category: null,
    };
};

export interface DashboardGraphStore {
    graphData: GraphData;
    settings: AnalysisSettings;
    graphSettings: GraphSettings;
    updateGraphData: (newGraphData: GraphData) => void;
    updateSettings: (newSettings: Partial<AnalysisSettings>) => void;
    updateGraphSettings: (newSettings: Partial<GraphSettings>) => void;
}
export const useDashboardGraphStore = create<DashboardGraphStore>((set) => {
    // Initialize the settings with the default settings and variables from add store
    const initializedSettings = getDefaultSettings();

    return {
        graphData: { nodes: [], links: [] },
        settings: initializedSettings,
        graphSettings: defaultGraphSettings,
        updateGraphData: (newGraphData) => set((state) => ({ graphData: { ...state.graphData, ...newGraphData } })),
        updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
        updateGraphSettings: (newGraphSettings) =>
            set((state) => ({ graphSettings: { ...state.graphSettings, ...newGraphSettings } })),
    };
});
