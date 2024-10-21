import { create } from "zustand";
import { db, SessionsSchema } from "@/modules/core/infrastructure/database";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import { socket } from "@/modules/core/helpers/socket";
import { Tutorial } from "../types/tutorial";

export interface CoreState {
    activePathogen: PathogenWithRelationships | null;
    session: SessionsSchema | undefined | null;
    casesWithRelationships: CaseWithRelationships[];
    tutorial: Tutorial;
    incrementTutorialSteps: () => void;
    updateCasesWithRelationships: () => Promise<void>;
    fetchSession: () => Promise<void>;
    initSession: () => Promise<void>;
    updateActivePathogen: (pathogen: PathogenSchema) => void;
}

const defaultTutorial: Tutorial = {
    tutorialIsActive: true,
    step: 0,
};

export const useCoreStore = create<CoreState>((set, get) => {
    return {
        activePathogen: null,
        session: undefined,
        casesWithRelationships: [],
        tutorial: defaultTutorial,
        incrementTutorialSteps: () =>
            set((state) => ({ tutorial: { ...state.tutorial, step: state.tutorial.step + 1 } })),
        decrementTutorialSteps: () =>
            set((state) => ({ tutorial: { ...state.tutorial, step: state.tutorial.step - 1 } })),
        updateCasesWithRelationships: async () => {
            const activePathogenId = get().activePathogen?.id;
            if (!activePathogenId) return;
            const casesWithRelationships = await getAllCasesForPathogenWithRelationships(activePathogenId);
            set({ casesWithRelationships });
        },
        fetchSession: async () => {
            const session = (await db.sessions.toCollection().first()) ?? null;
            set({ session });
        },
        initSession: async () => {
            const sessionId = await db.sessions.add({});
            set({ session: { id: sessionId } });
            if (socket) {
                socket.emit("init_gentrain_session", sessionId);
            }
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
            get().updateCasesWithRelationships();
        },
    };
});
