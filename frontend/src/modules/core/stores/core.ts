import { create } from "zustand";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import gentrainWebsocketInstance from "../adapters/GentrainWebsocket";
import { createSessionId } from "../helpers/session";
import { persist } from "zustand/middleware";

type CoreStoreState = {
    activePathogen: PathogenWithRelationships | null;
    pathogenIsLoading: boolean;
    sessionId: string | null | undefined;
    casesWithRelationships: CaseWithRelationships[];
};

type CoreStoreActions = {
    updateCasesWithRelationships: () => Promise<void>;
    initSession: () => void;
    updateActivePathogen: (pathogen: PathogenSchema | null) => void;
    setPathogenIsLoading: (pathogenIsLoading: boolean) => void;
};

export type CoreStore = CoreStoreState & CoreStoreActions;

export const useCoreStore = create<CoreStore>()(
    persist(
        (set, get) => ({
            activePathogen: null,
            pathogenIsLoading: false,
            sessionId: undefined,
            casesWithRelationships: [],
            updateCasesWithRelationships: async () => {
                const activePathogenId = get().activePathogen?.id;
                if (!activePathogenId) return;
                const casesWithRelationships = await getAllCasesForPathogenWithRelationships(activePathogenId);
                set({ casesWithRelationships });
            },
            initSession: () => {
                const sessionId = createSessionId();
                set({ sessionId: sessionId });
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
            setPathogenIsLoading: (pathogenIsLoading) => {
                set({ pathogenIsLoading: pathogenIsLoading });
            },
        }),
        {
            name: "core",
            partialize: (state) => ({
                activePathogen: state.activePathogen,
                sessionId: state.sessionId,
            }),
            onRehydrateStorage: () => (state) => {
                // When store is rehydrated, if there's an active pathogen, load its cases
                if (state?.activePathogen) {
                    state.updateCasesWithRelationships();
                }
            },
        }
    )
);
