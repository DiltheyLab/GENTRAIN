import { CaseWithRelationships, getAllCasesForPathogenWithRelationships } from "@/database/cases";
import { useAppStore } from "@/stores/app";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCasesForActivePathogenWithRelationships = (): CaseWithRelationships[] | undefined => {
    const activePathogen = useAppStore.getState().activePathogen;
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getAllCasesForPathogenWithRelationships(activePathogen.id);
    }, [activePathogen]);
};
