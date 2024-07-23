import { create } from "zustand";
import { GraphData } from "./graph";
import { OutbreakSchema } from "@/database/outbreak";
import { GroupSchema } from "@/database/groups";
import { CategorySchema } from "@/database/categories";

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
    selectedOutbreak: OutbreakSchema | null;
    selectedBackground: SelectedBackground | null;
    includeCasesWithoutOutbreak: boolean;
    ignoreBackground: boolean;
    includeCasesWithLowGeneticDistance: boolean;
    startDate: Date;
    endDate: Date;
    geneticDistanceThreshold: number;
    showContactTracingEdges: boolean;
    hideEdgesAboveThreshold: boolean;
    groupColorations: GroupColoration;
    category: CategorySchema | null;
};

export interface AnalysisStore {
    id: number | null;
    name: string | null;
    graphData: GraphData;
    settings: AnalysisSettings;
    updateId: (newId: number) => void;
    updateName: (newName: string) => void;
    updateGraphData: (newGraphData: GraphData) => void;
    updateSettings: (newSettings: Partial<AnalysisSettings>) => void;
}

export const defaultSettings: AnalysisSettings = {
    selectedOutbreak: null,
    selectedBackground: null,
    includeCasesWithoutOutbreak: false,
    ignoreBackground: false,
    includeCasesWithLowGeneticDistance: false,
    startDate: new Date(),
    endDate: new Date(),
    geneticDistanceThreshold: 2,
    showContactTracingEdges: true,
    hideEdgesAboveThreshold: false,
    groupColorations: [],
    category: null,
};

export const useAnalysisStore = create<AnalysisStore>((set) => ({
    id: null,
    name: null,
    graphData: { nodes: [], links: [] },
    settings: defaultSettings,
    updateId: (newId) => set({ id: newId }),
    updateName: (newName) => set({ name: newName }),
    updateGraphData: (newGraphData) => set((state) => ({ graphData: { ...state.graphData, ...newGraphData } })),
    updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));
