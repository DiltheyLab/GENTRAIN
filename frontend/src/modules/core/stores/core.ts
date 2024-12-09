import { create } from "zustand";
import { db } from "@/modules/core/infrastructure/database";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import { Step } from "react-joyride";
import { tutorialSteps } from "../components/tutorial/tutorialSteps";
import { SessionSchema } from "../models/sessions";
import gentrainWebsocketInstance from "../adapters/GentrainWebsocket";

export interface CoreState {
    activePathogen: PathogenWithRelationships | null;
    session: SessionSchema | undefined | null;
    casesWithRelationships: CaseWithRelationships[];
    tutorialIsRunning: boolean;
    tutorialSteps: Step[];
    tutorialStepIndex: number;
    tutorialTourIsActive: boolean;
    changeTutorialStepIndex: (index: number) => void;
    changeTutorialTourIsActive: (isActive: boolean) => void;
    changeTutorialIsRunning: (tutorialIsRunnung: boolean) => void;
    updateCasesWithRelationships: () => Promise<void>;
    fetchSession: () => Promise<void>;
    initSession: () => Promise<void>;
    updateActivePathogen: (pathogen: PathogenSchema | null) => void;
}

export const useCoreStore = create<CoreState>((set, get) => {
    return {
        activePathogen: null,
        session: undefined,
        casesWithRelationships: [],
        tutorialStepIndex: 0,
        tutorialTourIsActive: false,
        tutorialIsRunning: false,
        tutorialSteps: tutorialSteps,
        changeTutorialStepIndex: (index) => set(() => ({ tutorialStepIndex: index })),
        changeTutorialIsRunning: (tutorialIsRunnung) => set(() => ({ tutorialIsRunning: tutorialIsRunnung })),
        changeTutorialTourIsActive: (isActive) => set(() => ({ tutorialTourIsActive: isActive })),
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
            gentrainWebsocketInstance.initSession(sessionId);
        },
        updateActivePathogen: async (pathogen: PathogenWithRelationships | null) => {
            if (!pathogen) {
                set({ activePathogen: pathogen });
                return;
            }
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
