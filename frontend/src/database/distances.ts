import { db } from "./db";

export interface DistancesSchema {
    id: number;
    sample_id_1: number;
    sample_id_2: number;
    distance_matrix_id: number;
    value: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface DistanceWithFastaId {
    fasta_id_1: string;
    fasta_id_2: string;
    value: number;
}

export const getAllDistancesForDistanceMatrixWithFastaIds = async (distanceMatrixId: number) => {
    const distances = await db.distances.where({ distance_matrix_id: distanceMatrixId }).toArray();
    let distancesWithFastaIds = [];
    for (const distance of distances) {
        const sample1 = await db.samples.get(distance.sample_id_1);
        const sample2 = await db.samples.get(distance.sample_id_2);

        if (!sample1 || !sample2) {
            return null;
        }

        const distanceWithFastaId: DistanceWithFastaId = {
            fasta_id_1: sample1.fasta_id,
            fasta_id_2: sample2.fasta_id,
            value: distance.value,
        };

        distancesWithFastaIds.push(distanceWithFastaId);
    }

    return distancesWithFastaIds;
};
