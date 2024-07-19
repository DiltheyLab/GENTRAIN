import { assembleDistanceMatrixByPathogenId, DistanceMatrixAssembly } from "@/database/distance_matrices";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetDistanceMatrixAssemblyByPathogenId = (
    pathogen_id: number | undefined
): DistanceMatrixAssembly | undefined | null => {
    return useLiveQuery(async () => {
        if (!pathogen_id) {
            return;
        }
        const assembly = await assembleDistanceMatrixByPathogenId(pathogen_id);
        return assembly;
    }, [pathogen_id]);
};
