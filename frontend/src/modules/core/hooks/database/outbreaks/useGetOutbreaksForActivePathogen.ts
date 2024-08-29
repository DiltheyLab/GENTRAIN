import { getOutbreaksForPathogenId } from "@/modules/core/models/outbreaks";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetOutbreaksForActivePathogen = () => {
    const activePathogen = useCoreStore.getState().activePathogen;
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getOutbreaksForPathogenId(activePathogen.id);
    }, [activePathogen]);
};
