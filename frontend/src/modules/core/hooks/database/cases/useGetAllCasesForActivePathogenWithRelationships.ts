import { getAllCasesForPathogenWithRelationships } from "@/modules/core/models/cases";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCasesForActivePathogenWithRelationships = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getAllCasesForPathogenWithRelationships(activePathogen.id);
    }, [activePathogen]);
};
