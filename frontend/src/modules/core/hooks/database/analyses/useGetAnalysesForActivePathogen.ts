import { AnalysisSchema, getAnalysesForPathogenId } from "@/database/analyses";
import { useAppStore } from "@/stores/app";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAnalysesForActivePathogen = (): AnalysisSchema[] | undefined => {
    const activePathogen = useAppStore.getState().activePathogen;
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getAnalysesForPathogenId(activePathogen.id);
    }, [activePathogen]);
};
