import { db } from "@/modules/core/services/database/DatabaseManager";
import { SampleSchema } from "./samples";
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

    const sampleId = new Set<number>();
    for (const distance of distances) {
        sampleId.add(distance.sample_id_1);
        sampleId.add(distance.sample_id_2);
    }

    const samples = await db.samples.bulkGet(Array.from(sampleId));

    const sampleMap = new Map<number, SampleSchema>();

    for (const sample of samples) {
        if (!sample) continue;
        sampleMap.set(sample.id, sample);
    }

    for (const distance of distances) {
        const sample1 = sampleMap.get(distance.sample_id_1);
        const sample2 = sampleMap.get(distance.sample_id_2);

        if (!sample1 || !sample2) {
            return;
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

export const deleteDistancesByPathogenId = async (pathogen_id: number) => {
    const distanceMatrixForPathogen = await db.distance_matrices.where({ pathogen_id: pathogen_id }).first();
    if (distanceMatrixForPathogen) {
        await db.distances.where({ distance_matrix_id: distanceMatrixForPathogen.id }).delete();
    }
};

export const deleteDistancesBySampleId = async (sample_id: number) => {
    await db.distances.where({ sample_id_1: sample_id }).or("sample_id_2").equals(sample_id).delete();
};

/* 
export const getDistancesFromSampleIdsBelowThreshold = async (sampleIds: number[], threshold: number) => {
    return db.distances
        .where("sample_id_1")
        .anyOf(sampleIds)
        .or("sample_id_2")
        .anyOf(sampleIds)
        .and((distance) => distance.value <= threshold)
        .toArray();
};
 */

export const getDistancesFromSampleIdsBelowThreshold = async (sampleIds: number[], threshold: number) => {
    const distances = await db.distances.toArray();
    return distances.filter((distance) => {
        const { sample_id_1, sample_id_2, value } = distance;
        return (sampleIds.includes(sample_id_1) || sampleIds.includes(sample_id_2)) && value <= threshold;
    });
};
