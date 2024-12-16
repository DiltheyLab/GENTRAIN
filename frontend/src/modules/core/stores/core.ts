import { create } from "zustand";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import gentrainWebsocketInstance from "../adapters/GentrainWebsocket";
import { createSessionId } from "../helpers/session";

type CoreStoreState = {
    activePathogen: PathogenWithRelationships | null;
    pathogenIsLoading: boolean;
    sessionId: string | null | undefined;
    casesWithRelationships: CaseWithRelationships[];
};

type CoreStoreActions = {
    updateCasesWithRelationships: () => Promise<void>;
    fetchSession: () => Promise<void>;
    initSession: () => Promise<void>;
    updateActivePathogen: (pathogen: PathogenSchema | null) => void;
    setPathogenIsLoading: (pathogenIsLoading: boolean) => void;
};

export type CoreStore = CoreStoreState & CoreStoreActions;

export const useCoreStore = create<CoreStore>((set, get) => {
    return {
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
        fetchSession: async () => {
            const session = localStorage.getItem("session");
            set({ sessionId: session });
        },
        initSession: async () => {
            const sessionId = createSessionId();
            localStorage.setItem("session", sessionId);
            set({ sessionId: sessionId });
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
        setPathogenIsLoading: (pathogenIsLoading) => {
            set({ pathogenIsLoading: pathogenIsLoading });
        },
    };
});
