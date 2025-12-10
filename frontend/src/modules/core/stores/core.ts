import { create } from "zustand";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

type CoreStoreState = {
    activePathogen: PathogenWithRelationships | null;
    pathogenIsLoading: boolean;
    loadingBlockerIsActive: boolean;
    sessionId: string | null | undefined;
    casesWithRelationships: CaseWithRelationships[];
};

type CoreStoreActions = {
    updateCasesWithRelationships: () => Promise<void>;
    initSession: () => void;
    setLoadingBlockerIsActive: (loadingBlockerIsActive: boolean) => void;
    updateActivePathogen: (pathogen: PathogenSchema | null) => void;
    setPathogenIsLoading: (pathogenIsLoading: boolean) => void;
};

export type CoreStore = CoreStoreState & CoreStoreActions;

export const useCoreStore = create<CoreStore>()(
    persist(
        (set, get) => ({
            activePathogen: null,
            pathogenIsLoading: false,
            loadingBlockerIsActive: false,
            sessionId: undefined,
            casesWithRelationships: [],
            updateCasesWithRelationships: async () => {
                const activePathogenId = get().activePathogen?.id;
                if (!activePathogenId) return;
                const casesWithRelationships = await getAllCasesForPathogenWithRelationships(activePathogenId);
                set({ casesWithRelationships });
            },
            initSession: () => {
                const sessionId = uuidv4();
                set({ sessionId: sessionId });
            },
            setLoadingBlockerIsActive: (loadingBlockerIsActive: boolean) => {
                set({ loadingBlockerIsActive: loadingBlockerIsActive });
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
                const casesWithRelationships = await getAllCasesForPathogenWithRelationships(pathogen.id);
                set({
                    casesWithRelationships: casesWithRelationships,
                    activePathogen: pathogen,
                });
            },
            setPathogenIsLoading: pathogenIsLoading => {
                set({ pathogenIsLoading: pathogenIsLoading });
            },
        }),
        {
            name: "core",
            partialize: state => ({
                activePathogen: state.activePathogen,
                sessionId: state.sessionId,
            }),
            onRehydrateStorage: () => state => {
                // When store is rehydrated, if there's an active pathogen, load its cases
                if (state?.activePathogen) {
                    state.updateCasesWithRelationships();
                }
            },
        }
    )
);
