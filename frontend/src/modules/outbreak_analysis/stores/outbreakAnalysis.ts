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

export type GeneralSettings = {
    openAccordionItems: string[];
    autoSave: boolean;
};

export type GraphSettings = {
    showNodeLabel: boolean;
    linkDistance: number;
    colorMap: ColorMap;
    coloringMode: ColoringMode;
    nodeSize: number;
    linkWidth: number;
    charge: number;
    zoomToFitToggle: boolean;
};

export type AnalysisReport = {
    summary: string | null;
    conclusion: string | null;
};

export const defaultGraphSettings: GraphSettings = {
    showNodeLabel: false,
    linkDistance: 70,
    colorMap: {},
    coloringMode: "outbreaks",
    nodeSize: 6,
    linkWidth: 2.5,
    charge: -80,
    zoomToFitToggle: false,
};
export const defaultGeneralSettings: GeneralSettings = {
    autoSave: true,
    openAccordionItems: ["outbreak-selection"],
};

export const getDefaultAnalysisSettings = (): AnalysisSettings => {
    const geneticDistanceThreshold = useCoreStore.getState().activePathogen?.genetic_distance_threshold;

    return {
        backgroundType: "none",
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

type OutbreakAnalysisStoreState = {
    id: number | null;
    name: string | null;
    graphData: GraphData;
    analysisSettings: AnalysisSettings;
    graphSettings: GraphSettings;
    generalSettings: GeneralSettings;
    analysisReport: AnalysisReport;
};

type OutbreakAnalysisStoreActions = {
    updateId: (newId: number) => void;
    updateName: (newName: string) => void;
    updateAnalysisReport: (newAnalysisReport: Partial<AnalysisReport>) => void;
    updateGraphData: (newGraphData: GraphData) => void;
    updateAnalysisSettings: (newAnalysisSettings: Partial<AnalysisSettings>) => void;
    updateGraphSettings: (newGraphSettings: Partial<GraphSettings>) => void;
    updateGeneralSettings: (newGeneralSettings: Partial<GeneralSettings>) => void;
    updateWholeAnalysis: (
        newId: number,
        newName: string,
        newAnalysisSettings: AnalysisSettings,
        newGraphSettings: GraphSettings,
        newGeneralSettings: GeneralSettings
    ) => void;
};

export type OutbreakAnalysisStore = OutbreakAnalysisStoreState & OutbreakAnalysisStoreActions;

export const useOutbreakAnalysisStore = create<OutbreakAnalysisStore>((set) => {
    // Initialize the settings with the default settings and variables from add store
    const initializedAnalysisSettings = getDefaultAnalysisSettings();

    return {
        id: null,
        name: null,
        analysisReport: { summary: null, conclusion: null },
        graphData: { nodes: [], links: [] },
        analysisSettings: initializedAnalysisSettings,
        graphSettings: defaultGraphSettings,
        generalSettings: defaultGeneralSettings,
        updateId: (newId) => set({ id: newId }),
        updateName: (newName) => set({ name: newName }),
        updateAnalysisReport: (newAnalysisReport) =>
            set((state) => ({ analysisReport: { ...state.analysisReport, ...newAnalysisReport } })),
        updateGraphData: (newGraphData) => set((state) => ({ graphData: { ...state.graphData, ...newGraphData } })),
        updateAnalysisSettings: (newAnalysisSettings) =>
            set((state) => ({ analysisSettings: { ...state.analysisSettings, ...newAnalysisSettings } })),
        updateGraphSettings: (newGraphSettings) =>
            set((state) => ({ graphSettings: { ...state.graphSettings, ...newGraphSettings } })),
        updateGeneralSettings: (newGeneralSettings) =>
            set((state) => ({ generalSettings: { ...state.generalSettings, ...newGeneralSettings } })),
        updateWholeAnalysis: (newId, newName, newAnalysisSettings, newGraphSettings, newGeneralSettings) =>
            set({
                id: newId,
                name: newName,
                analysisSettings: newAnalysisSettings,
                graphSettings: newGraphSettings,
                generalSettings: newGeneralSettings,
            }),
    };
});
