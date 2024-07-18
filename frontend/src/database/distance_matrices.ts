import { assembleDistanceMatrix } from "@/services/distanceMatrices";
import { db } from "./db";

export interface DistanceMatricesSchema {
    id: number;
    pathogen_id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface DistanceMatrixAssembly {
    [row_sample_id: string]: { [col_sample_id: string]: number };
}

export const getDistanceMatrixByPathogenId = async (
    pathogen_id: number
): Promise<DistanceMatricesSchema | undefined> => {
    const distanceMatrixForActivePathogen = await db.distance_matrices.where({ pathogen_id: pathogen_id }).first();
    return distanceMatrixForActivePathogen;
};

export const assembleDistanceMatrixByPathogenId = async (
    pathogen_id: number
): Promise<DistanceMatrixAssembly | undefined | null> => {
    const distanceMatrix = await db.distance_matrices.where({ pathogen_id: pathogen_id }).first();
    if (!distanceMatrix) {
        return null;
    }
    return assembleDistanceMatrix(distanceMatrix.id);
};
