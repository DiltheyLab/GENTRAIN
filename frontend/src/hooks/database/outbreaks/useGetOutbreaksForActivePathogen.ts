import { getOutbreaksForPathogenId } from "@/database/outbreaks";
import { useAppStore } from "@/stores/app";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetGetOutbreaksForActivePathogen = () => {
    const activePathogen = useAppStore.getState().activePathogen;
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getOutbreaksForPathogenId(activePathogen.id);
    }, [activePathogen]);
};
