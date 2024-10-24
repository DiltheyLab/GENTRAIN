import { create } from "zustand";
import { db, SessionsSchema } from "@/modules/core/infrastructure/database";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import { socket } from "@/modules/core/helpers/socket";

export interface CoreState {
    activePathogen: PathogenWithRelationships | null;
    session: SessionsSchema | undefined | null;
    casesWithRelationships: CaseWithRelationships[];
    tutorialStep: number;
    tutorialTourIsActive: boolean;
    tutorialIntroIsActive: boolean;
    incrementTutorialSteps: () => void;
    decrementTutorialSteps: () => void;
    changeTutorialTourIsActive: (isActive: boolean) => void;
    changeTutorialIntroIsActive: (isActive: boolean) => void;
    updateCasesWithRelationships: () => Promise<void>;
    fetchSession: () => Promise<void>;
    initSession: () => Promise<void>;
    updateActivePathogen: (pathogen: PathogenSchema) => void;
}

export const useCoreStore = create<CoreState>((set, get) => {
    return {
        activePathogen: null,
        session: undefined,
        casesWithRelationships: [],
        tutorialStep: 0,
        tutorialTourIsActive: false,
        tutorialIntroIsActive: false,
        incrementTutorialSteps: () => set((state) => ({ tutorialStep: state.tutorialStep + 1 })),
        decrementTutorialSteps: () => set((state) => ({ tutorialStep: state.tutorialStep - 1 })),
        changeTutorialTourIsActive: (isActive) => set(() => ({ tutorialTourIsActive: isActive })),
        changeTutorialIntroIsActive: (isActive) => set(() => ({ tutorialIntroIsActive: isActive })),
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
