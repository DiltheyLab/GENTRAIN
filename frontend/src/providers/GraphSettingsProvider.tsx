import { createContext, useContext, useState } from "react";
import mst from "@/data/mst-data-vasturiano.json";

export type CustomNode = {
    id: string;
    group: string;
    color: string;
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

export type GraphSettings = {
    graphDimension: "2D" | "3D";
    hideNodeLabel: boolean;
    nodeSize: number;
    linkWidth: number;
    zoomToFit: boolean;
    charge: number;
    linkDistance: number;
    graphData: GraphData;
};

type GraphSettingsContextType = {
    settings: GraphSettings;
    updateSettings: (newSettings: Partial<GraphSettings>) => void;
};

type GraphSettingsProviderProps = {
    children: React.ReactNode;
};

const GraphSettingsContext = createContext<GraphSettingsContextType | null>(null);

const defaultGraphSettings: GraphSettings = {
    graphDimension: "2D",
    hideNodeLabel: false,
    nodeSize: 6,
    linkWidth: 3,
    zoomToFit: false,
    charge: -50,
    linkDistance: 50,
    graphData: mst as GraphData,
};

export const useGraphSettings = () => useContext(GraphSettingsContext);

export const GraphSettingsProvider = ({ children }: GraphSettingsProviderProps) => {
    const [settings, setSettings] = useState(defaultGraphSettings); // Initialize with the default settings structure

    const updateSettings = (newSettings: Partial<GraphSettings>) => {
        setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
    };

    return (
        <GraphSettingsContext.Provider value={{ settings: settings, updateSettings: updateSettings }}>
            {children}
        </GraphSettingsContext.Provider>
    );
};
