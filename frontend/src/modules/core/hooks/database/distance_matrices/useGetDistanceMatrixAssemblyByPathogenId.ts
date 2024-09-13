import { assembleDistanceMatrixByPathogenId, DistanceMatrixAssembly } from "@/modules/core/models/distance_matrices";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetDistanceMatrixAssemblyByPathogenId = (
    pathogen_id: number | undefined
): DistanceMatrixAssembly | undefined | null => {
    const distanceCalculationRunning = useDataManagementStore((state) => state.distanceCalculationRunning);
    return useLiveQuery(async () => {
        if (!pathogen_id || distanceCalculationRunning) return;
        const assembly = await assembleDistanceMatrixByPathogenId(pathogen_id);
        return assembly;
    }, [pathogen_id, distanceCalculationRunning]);
};
