import { assembleDistanceMatrixByPathogenId } from "@/modules/core/models/distance_matrices";
import { useCoreStore } from "@/modules/core/stores/core";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetDistanceMatrixAssembly = () => {
    const showSampleUploadStatus = useDataManagementStore((state) => state.showSampleUploadStatus);
    const activePathogenId = useCoreStore((state) => state.activePathogen?.id);
    return useLiveQuery(async () => {
        if (showSampleUploadStatus || !activePathogenId) return;
        const assembly = await assembleDistanceMatrixByPathogenId(activePathogenId);
        return assembly;
    }, [activePathogenId, showSampleUploadStatus]);
};
