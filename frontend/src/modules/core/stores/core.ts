import { db, SessionsSchema } from "@/modules/core/infrastructure/database";
import { create } from "zustand";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";

interface CoreState {
    activePathogen: PathogenSchema | null;
    session: SessionsSchema | undefined | null; //SessionSchema
    fetchSession: () => void;
    initSession: () => void;
    updateActivePathogen: (pathogen: PathogenSchema) => void;
}

export const useCoreStore = create<CoreState>((set, get) => {
    return {
        activePathogen: null,
        session: undefined,
        fetchSession: async () => {
            const session = (await db.sessions.toCollection().first()) ?? null;
            set({ session });
        },
        initSession: async () => {
            const sessionId = await db.sessions.add({});
            set({ session: { id: sessionId } });
        },
        updateActivePathogen: async (pathogen: PathogenWithRelationships) => {
            const activePathogen = get().activePathogen;
            if (activePathogen && activePathogen?.id !== pathogen.id) {
                db.pathogens.update(activePathogen.id, { activated_at: null });
            }
            if (activePathogen?.id !== pathogen.id) {
                db.pathogens.update(pathogen.id, { activated_at: new Date().toISOString() });
            }
            set({ activePathogen: pathogen });
        },
    };
});
