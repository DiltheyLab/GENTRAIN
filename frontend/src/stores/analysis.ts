import { create } from "zustand";
import { GroupSchema, GroupWithCategory } from "@/database/groups";
import { CategorySchema } from "@/database/categories";
import { useAppStore } from "./app";
import { addWeeks } from "date-fns";
import { DateRange } from "react-day-picker";
import { GraphData } from "@/types/graph";
import { OutbreakSchema } from "@/database/outbreaks";
import { COLORPALETTENODES } from "@/colors/colorPaletteNodes";

export type Filter = "all" | "outbreaks";
export type Coloring = "normal" | "registered_at" | "outbreaks";

export type GroupColoration = {
    group: GroupSchema;
    color: string;
    disableColoration: boolean;
}[];

export type SelectedBackground = {
    outbreaks: OutbreakSchema[];
    groupsWithCategories: GroupWithCategory[];
    casesWithoutOutbreakExist: boolean;
};

export type AnalysisSettings = {
    includeAllCases: boolean;
    selectedOutbreak: OutbreakSchema | null;
    datesOfCasesInSelectedOutbreak: Date[];
    selectedBackground: SelectedBackground | null;
    showBackground: boolean;
    includeCasesWithLowGeneticDistance: boolean;
    excludeCasesOutsideOfDateRange: boolean;
    dateRange: DateRange;
    geneticDistanceThreshold: number;
    showContactTracingEdges: boolean;
    hideEdgesAboveThreshold: boolean;
    groupColorations: GroupColoration;
    colorPaletteNodes: string[];
    category: CategorySchema | null;
};

export type GraphSettings = {
    showNodeLabel: boolean;
    linkDistance: number;
    graphDimension?: "2D" | "3D";
    nodeSize?: number;
    linkWidth?: number;
    zoomToFit?: boolean;
    charge?: number;
    coloring?: Coloring;
};

export interface AnalysisStore {
    id: number | null;
    name: string | null;
    graphData: GraphData;
    settings: AnalysisSettings;
    graphSettings: GraphSettings;
    updateId: (newId: number) => void;
    updateName: (newName: string) => void;
    updateGraphData: (newGraphData: GraphData) => void;
    updateSettings: (newSettings: Partial<AnalysisSettings>) => void;
    updateGraphSettings: (newSettings: Partial<GraphSettings>) => void;
}

export const defaultGraphSettings: GraphSettings = {
    showNodeLabel: true,
    linkDistance: 50,
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

export const useAnalysisStore = create<AnalysisStore>((set) => {
    // Initialize the settings with the default settings and variables from add store
    const initializedSettings = getDefaultSettings();

    return {
        id: null,
        name: null,
        graphData: { nodes: [], links: [] },
        settings: initializedSettings,
        graphSettings: defaultGraphSettings,
        updateId: (newId) => set({ id: newId }),
        updateName: (newName) => set({ name: newName }),
        updateGraphData: (newGraphData) => set((state) => ({ graphData: { ...state.graphData, ...newGraphData } })),
        updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
        updateGraphSettings: (newGraphSettings) =>
            set((state) => ({ graphSettings: { ...state.graphSettings, ...newGraphSettings } })),
    };
});
