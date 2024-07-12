import { db } from "@/database/db";
export interface DistanceMatrixSchema {
    id: string;
    name: string;
    row_column_names: Array<string>;
    matrix: Array<Array<number>>;
    pathogen_id: number;
    updated_at: string;
}

export const getDistanceMatrixByPathogenId = (pathogen_id: number): Promise<DistanceMatrixSchema | undefined> => {
    const distanceMatrixForActivePathogen = db.distance_matrix.where({ pathogen_id: pathogen_id }).first();
    return distanceMatrixForActivePathogen;
};
