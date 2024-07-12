import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { SampleSchema } from "./samples";

export interface DistanceMatrixSchema {
    id: string;
    name: string;
    row_column_names: Array<string>;
    matrix: Array<Array<number>>;
    pathogen_id: number;
    updated_at: string;
}

export const useDistanceMatrixGetById = (id: string): DistanceMatrixSchema | undefined => {
    return useLiveQuery(() => db.distance_matrix.get(id));
};

type DistanceMatrixAndSamples = {
    distanceMatrix: DistanceMatrixSchema | undefined;
    samples: SampleSchema[];
};

export const useDistanceMatrixAndSamplesGetByPathogenId = (
    pathogen_id: number
): DistanceMatrixAndSamples | undefined => {
    return useLiveQuery(async () => {
        const distance_matrix = await db.distance_matrix.where({ pathogen_id: pathogen_id }).first();
        console.log(pathogen_id, distance_matrix);
        const samples = await db.samples.toArray();
        return { distanceMatrix: distance_matrix, samples: samples };
    });
};
