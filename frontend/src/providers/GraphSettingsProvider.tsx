import { createContext, useContext, useState } from "react";

export type GraphSettings = {
    graphDimension: "2D" | "3D";
    hideNodeLabel: boolean;
    nodeSize: number;
    linkWidth: number;
    zoomToFit: boolean;
    charge: number;
    linkDistance: number;
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
