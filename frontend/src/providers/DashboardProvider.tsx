import { createContext, useContext, useState } from "react";

export type Settings = {
  graphDimension: "2D" | "3D";
  showIdAsNode: boolean;
  nodeSize: number;
  linkWidth: number;
  zoomToFit: boolean;
};

type DashboardContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

type DashboardProviderProps = {
  children: React.ReactNode;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

const initialSettings: Settings = {
  graphDimension: "2D",
  showIdAsNode: false,
  nodeSize: 5,
  linkWidth: 2,
  zoomToFit: false,
};

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [settings, setSettings] = useState(initialSettings); // Initialize with the default settings structure

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return <DashboardContext.Provider value={{ settings, updateSettings }}>{children}</DashboardContext.Provider>;
};
