import { create } from "zustand";
import { useCoreStore } from "../../core/stores/core";
import { addWeeks } from "date-fns";
import { DateRange } from "react-day-picker";
import { ColoringMode, ColorMap, GraphData } from "@/modules/core/types/graph";
import { GroupSchema, GroupWithCategory } from "@/modules/core/models/groups";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";

export type BackgroundType = "all" | "specific" | "none";

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
    backgroundType: BackgroundType;
    selectedOutbreak: OutbreakSchema | null;
    datesOfCasesInSelectedOutbreak: Date[];
    selectedBackground: SelectedBackground | null;
    excludeCasesAboveGeneticDistanceThreshold: boolean;
    excludeCasesOutsideOfDateRange: boolean;
    excludeCasesWithoutSequence: boolean;
    dateRange: DateRange;
    geneticDistanceThreshold: number;
    showContactTracingLinks: boolean;
    clusteringThreshold: number;
};

export type GraphSettings = {
    showNodeLabel: boolean;
    linkDistance: number;
    colorMap: ColorMap;
    coloringMode: ColoringMode;
    nodeSize: number;
    linkWidth: number;
    charge: number;
};

export interface OutbreakAnalysisStore {
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
    showNodeLabel: false,
    linkDistance: 70,
    colorMap: {},
    coloringMode: "outbreaks",
    nodeSize: 6,
    linkWidth: 2.5,
    charge: -80,
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
        excludeCasesWithoutSequence: true,
        dateRange: { from: addWeeks(new Date(), -3), to: new Date() },
        geneticDistanceThreshold: geneticDistanceThreshold ?? 0,
        showContactTracingLinks: false,
        clusteringThreshold: geneticDistanceThreshold ?? 0,
    };
};

export const useOutbreakAnalysisStore = create<OutbreakAnalysisStore>((set) => {
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
