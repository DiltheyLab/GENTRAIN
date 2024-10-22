import { getGroupsForPathogenId } from "@/modules/core/models/groups";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetGroupsForActivePathogen = () => {
    const activePathogen = useCoreStore.getState().activePathogen;
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getGroupsForPathogenId(activePathogen.id);
    }, [activePathogen]);
};
