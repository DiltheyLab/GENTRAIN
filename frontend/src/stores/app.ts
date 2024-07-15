import { db } from "@/database/db";
import { PathogenSchema } from "@/database/pathogens";
import { create } from "zustand";

interface AppState {
    activePathogen: PathogenSchema | null;
    updateActivePathogen: (pathogen: PathogenSchema) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    activePathogen: null,
    updateActivePathogen: (pathogen: PathogenSchema) => {
        const activePathogen = get().activePathogen;
        if (activePathogen && activePathogen?.id !== pathogen.id) {
            db.pathogens.update(activePathogen.id, { activated_at: null });
        }
        if (activePathogen?.id !== pathogen.id) {
            db.pathogens.update(pathogen.id, { activated_at: new Date().toISOString() });
        }
        set({ activePathogen: pathogen });
    },
}));
