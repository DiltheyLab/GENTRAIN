import { PathogenSchema } from "@/database/pathogens";
import { createContext, useContext, useState } from "react";

type AppContextType = {
    pathogen: PathogenSchema | null;
    updatePathogen: (pathogen: PathogenSchema) => void;
};

type AppProviderProps = {
    children: React.ReactNode;
};

export type App = {
    pathogen: PathogenSchema | null;
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: AppProviderProps) => {
    const [pathogen, setPathogen] = useState<PathogenSchema | null>(null);

    const updatePathogen = (newPathogen: PathogenSchema) => {
        setPathogen(newPathogen);
    };

    return (
        <AppContext.Provider value={{ pathogen: pathogen, updatePathogen: updatePathogen }}>
            {children}
        </AppContext.Provider>
    );
};
