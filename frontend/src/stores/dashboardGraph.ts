import { GraphData } from "@/types/graph";
import { create } from "zustand";
import { AnalysisSettings, GraphSettings } from "./analysis";
import { useAppStore } from "./app";
import { addWeeks } from "date-fns";
import { COLORPALETTENODES } from "@/colors/colorPalettes";

const defaultGraphSettings: GraphSettings = {
    showNodeLabel: false,
    nodeSize: 6,
    linkWidth: 3,
    zoomToFit: false,
    charge: -80,
    linkDistance: 50,
};

export const getDefaultSettings = (): AnalysisSettings => {
    const geneticDistanceThreshold = useAppStore.getState().activePathogen?.genetic_distance_threshold;
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
