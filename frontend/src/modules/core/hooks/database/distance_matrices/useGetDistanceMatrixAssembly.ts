import { assembleDistanceMatrixByPathogenId } from "@/modules/core/models/distance_matrices";
import { useCoreStore } from "@/modules/core/stores/core";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetDistanceMatrixAssembly = () => {
    const activePathogenId = useCoreStore((state) => state.activePathogen?.id);
    const distanceCalculationRunning = useDataManagementStore((state) => state.distanceCalculationRunning);
    return useLiveQuery(async () => {
        if (!activePathogenId || distanceCalculationRunning) return;
        const assembly = await assembleDistanceMatrixByPathogenId(activePathogenId);
        return assembly;
    }, [activePathogenId, distanceCalculationRunning]);
};
