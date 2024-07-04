import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export interface DistanceMatrixSchema {
    id: string;
    row_column_names: Array<string>;
    matrix: Array<Array<number>>;
    updated_at: string;
}

export const useDistanceMatrixGetById = (id: string): DistanceMatrixSchema | undefined => {
    return useLiveQuery(() => db.distance_matrix.get(id));
};
