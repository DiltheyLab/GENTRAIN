import { AnalysisSchema, getAnalysesForPathogenId } from "@/modules/core/models/analyses";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAnalysesForActivePathogen = (): AnalysisSchema[] | undefined => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    return useLiveQuery(() => {
        if (!activePathogen) {
            return;
        }
        return getAnalysesForPathogenId(activePathogen.id);
    }, [activePathogen]);
};
