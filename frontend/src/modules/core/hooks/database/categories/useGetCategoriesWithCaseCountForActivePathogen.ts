import { getCategoriesWithGroupsAndCaseCountForActivePathogen } from "@/modules/core/models/categories";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetCategoriesWithGroupsAndCaseCountForActivePathogen = () => {
    const activePathogen = useCoreStore.getState().activePathogen;
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getCategoriesWithGroupsAndCaseCountForActivePathogen(activePathogen.id);
    }, [activePathogen]);
};
