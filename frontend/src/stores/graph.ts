import { create } from "zustand";

export type CustomNode = {
    id: string;
    group: string;
    color: string;
    registeredAt?: string;
};

export type LinkType = "ArrowToTarget" | "ArrowToSource" | "ArrowBidirectional" | "Dashed" | "Solid";

export type CustomLink = {
    source: string;
    target: string;
    value: number;
    type: LinkType;
};

export type GraphData = {
    nodes: CustomNode[];
    links: CustomLink[];
};

export type Filter = "all" | "outbreaks";
export type Coloring = "normal" | "registered_at" | "outbreaks";

export type GraphSettings = {
    graphDimension: "2D" | "3D";
    hideNodeLabel: boolean;
    nodeSize: number;
    linkWidth: number;
    zoomToFit: boolean;
    charge: number;
    linkDistance: number;
    filter: Filter;
    coloring: Coloring;
};
export type Graph = {
    settings: GraphSettings;
    data: GraphData;
};

const defaultGraph: Graph = {
    settings: {
        graphDimension: "2D",
        hideNodeLabel: false,
        nodeSize: 6,
        linkWidth: 3,
        zoomToFit: false,
        charge: -50,
        linkDistance: 50,
        filter: "all",
        coloring: "normal",
    },
    data: { nodes: [], links: [] },
};
export interface GraphStore {
    settings: GraphSettings;
    data: GraphData;
    updateSettings: (newSettings: Partial<GraphSettings>) => void;
    updateData: (newData: GraphData) => void;
}

export const useGraphStore = create<GraphStore>((set) => ({
    settings: defaultGraph.settings,
    data: defaultGraph.data,
    updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
}));
