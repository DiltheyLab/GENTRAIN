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

export type AnalysisSettings = {
    selectedOutbreak: OutbreakSchema | null;
    selectedBackground: GroupSchema[];
    ignoreBackground: boolean;
    addCasesWithLowGeneticDistance: boolean;
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
    graphData: GraphData | null;
    settings: AnalysisSettings;
    updateId: (newId: number) => void;
    updateName: (newName: string) => void;
    updateGraphData: (newGraphData: GraphData) => void;
    updateSettings: (newSettings: Partial<AnalysisSettings>) => void;
}

export const defaultSettings: AnalysisSettings = {
    selectedOutbreak: null,
    selectedBackground: [],
    ignoreBackground: false,
    addCasesWithLowGeneticDistance: false,
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
    graphData: null,
    settings: defaultSettings,
    updateId: (newId) => set({ id: newId }),
    updateName: (newName) => set({ name: newName }),
    updateGraphData: (newGraphData) => set((state) => ({ graphData: { ...state.graphData, ...newGraphData } })),
    updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
}));
