import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCasesForActivePathogenWithRelationships = (): CaseWithRelationships[] | undefined => {
    const activePathogen = useCoreStore.getState().activePathogen;
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getAllCasesForPathogenWithRelationships(activePathogen.id);
    }, [activePathogen]);
};
