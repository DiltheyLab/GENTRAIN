import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { SampleSchema } from "./samples";

export interface DistanceMatrixSchema {
    id: string;
    row_column_names: Array<string>;
    matrix: Array<Array<number>>;
    updated_at: string;
}

export const useDistanceMatrixGetById = (id: string): DistanceMatrixSchema | undefined => {
    return useLiveQuery(() => db.distance_matrix.get(id));
};

type DistanceMatrixAndSamples = {
    distanceMatrix: DistanceMatrixSchema | undefined;
    samples: SampleSchema[];
};

export const useDistanceMatrixAndSamplesGetById = (id: string): DistanceMatrixAndSamples | undefined => {
    return useLiveQuery(async () => {
        const distance_matrix = await db.distance_matrix.get(id);
        const samples = await db.samples.toArray();
        return { distanceMatrix: distance_matrix, samples: samples };
    });
};
