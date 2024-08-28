import { assembleDistanceMatrix } from "@/services/distanceMatrices";
import { db } from "./db";

export interface DistanceMatricesSchema {
    id: number;
    pathogen_id: number;
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

export const getOrCreateDistanceMatrixIdByPathogenId = async (pathogen_id: number): Promise<number> => {
    const distanceMatrixForActivePathogen = await db.distance_matrices.where({ pathogen_id: pathogen_id }).first();
    if (distanceMatrixForActivePathogen) {
        return distanceMatrixForActivePathogen.id;
    }
    const distanceMatrixId = await db.distance_matrices.add({
        pathogen_id: pathogen_id,
    });
    return distanceMatrixId;
};

export const updateDistanceMatrixById = async (distance_matrix_id: number, fields: object) => {
    await db.distance_matrices.update(distance_matrix_id, fields);
};

export const deleteDistanceMatrixByPathogenId = async (pathogen_id: number) => {
    await db.distance_matrices.where({ pathogen_id: pathogen_id }).delete();
};

export const assembleDistanceMatrixByPathogenId = async (pathogen_id: number) => {
    const distanceMatrix = await db.distance_matrices.where({ pathogen_id: pathogen_id }).first();
    if (!distanceMatrix) return;

    const matrix = await assembleDistanceMatrix(distanceMatrix.id);
    return matrix;
};
