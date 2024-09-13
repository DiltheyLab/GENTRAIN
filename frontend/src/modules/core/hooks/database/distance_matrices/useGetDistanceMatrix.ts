import { getDistanceMatrixByPathogenId } from "@/modules/core/models/distance_matrices";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetDistanceMatrix = () => {
    const activePathogenId = useCoreStore((state) => state.activePathogen?.id);

    return useLiveQuery(async () => {
        if (!activePathogenId) return;
        const distance_matrix = await getDistanceMatrixByPathogenId(activePathogenId);
        return distance_matrix;
    }, [activePathogenId]);
};
