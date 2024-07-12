import { db } from "@/database/db";
import { PathogenSchema, usePathogensGetAll } from "@/database/pathogens";
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
    const updatePathogen = (seletedPathogen: PathogenSchema) => {
        setPathogen(seletedPathogen);
        if (pathogen) {
            db.pathogens.update(pathogen.id, { activated_at: null });
        }
        db.pathogens.update(seletedPathogen.id, { activated_at: new Date().toISOString() });
    };

    return (
        <AppContext.Provider value={{ pathogen: pathogen, updatePathogen: updatePathogen }}>
            {children}
        </AppContext.Provider>
    );
};
