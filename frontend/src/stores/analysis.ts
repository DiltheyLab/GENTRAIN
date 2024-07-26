import { create } from "zustand";
import { GraphData } from "./graph";
import { OutbreakSchema } from "@/database/outbreak";
import { GroupSchema } from "@/database/groups";
import { CategorySchema } from "@/database/categories";
import { useAppStore } from "./app";
import { addWeeks } from "date-fns";
import { DateRange } from "react-day-picker";

type GroupColoration = {
    group: GroupSchema;
    color: string;
    disableColoration: boolean;
}[];

export type SelectedBackground = {
    outbreaks: OutbreakSchema[];
    groups: GroupSchema[];
};

export type AnalysisSettings = {
    includeAllCases: boolean;
    selectedOutbreak: OutbreakSchema | null;
    selectedBackground: SelectedBackground | null;
    includeCasesWithoutOutbreak: boolean;
    ignoreBackground: boolean;
    includeCasesWithLowGeneticDistance: boolean;
    dateRange: DateRange;
    geneticDistanceThreshold: number;
    showContactTracingEdges: boolean;
    hideEdgesAboveThreshold: boolean;
    groupColorations: GroupColoration;
    category: CategorySchema | null;
};

export type GraphSettings = {
    hideNodeLabel: boolean;
    linkDistance: number;
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
    hideNodeLabel: false,
    linkDistance: 50,
};

export const getDefaultSettings = (): AnalysisSettings => {
    const relationshipThreshold = useAppStore.getState().activePathogen?.relationship_threshold;
    return {
        includeAllCases: false,
        selectedOutbreak: null,
        selectedBackground: null,
        includeCasesWithoutOutbreak: false,
        ignoreBackground: false,
        includeCasesWithLowGeneticDistance: false,
        dateRange: { from: addWeeks(new Date(), -3), to: new Date() },
        geneticDistanceThreshold: relationshipThreshold ?? 0,
        showContactTracingEdges: true,
        hideEdgesAboveThreshold: false,
        groupColorations: [],
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
