import { DistanceMatrixSchema, getDistanceMatrixByPathogenId } from "@/database/distance_matrix";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetDistanceMatrixByPathogenId = (pathogen_id: number | undefined): DistanceMatrixSchema | undefined => {
    return useLiveQuery(async () => {
        if (!pathogen_id) {
            return;
        }
        const distance_matrix = await getDistanceMatrixByPathogenId(pathogen_id);
        return distance_matrix;
    }, [pathogen_id]);
};
