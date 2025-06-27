import { db } from "@/modules/core/services/database/DatabaseManager";
import { CaseWithRelationships } from "./cases";
export interface DistancesSchema {
    id: number;
    case_id_1: number;
    case_id_2: number;
    distance_matrix_id: number;
    value: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface DistanceWithCaseReferences {
    case_reference_1: string;
    case_reference_2: string;
    value: number;
}

/**
 * Retrieves all distances for a given distance matrix ID, including case references.
 * This function fetches distances from the database, retrieves associated cases,
 * and constructs an array of distances with case references.
 *
 * @param distanceMatrixId - The ID of the distance matrix to retrieve distances for.
 * @returns A promise that resolves to an array of distances with case references.
 */
export const getAllDistancesForDistanceMatrixWithCaseReferences = async (distanceMatrixId: number) => {
    const distances = await db.distances.where({ distance_matrix_id: distanceMatrixId }).toArray();
    const distancesWithFastaIds = [];

    const caseReferences = new Set<number>();
    for (const distance of distances) {
        caseReferences.add(distance.case_id_1);
        caseReferences.add(distance.case_id_2);
    }

    const cases = await db.cases.bulkGet(Array.from(caseReferences));

    const caseMap = new Map<number, CaseWithRelationships>();

    for (const currentCase of cases) {
        if (!currentCase) continue;
        caseMap.set(currentCase.id, currentCase);
    }

    for (const distance of distances) {
        const case1 = caseMap.get(distance.case_id_1);
        const case2 = caseMap.get(distance.case_id_2);

        if (!case1 || !case2) {
            return;
        }

        const distanceWithCaseReferences: DistanceWithCaseReferences = {
            case_reference_1: case1.case_id,
            case_reference_2: case2.case_id,
            value: distance.value,
        };

        distancesWithFastaIds.push(distanceWithCaseReferences);
    }

    return distancesWithFastaIds;
};

/**
 * Deletes all distances associated with the specified pathogen ID.
 * This function first retrieves the distance matrix for the given pathogen ID,
 * then deletes all distances that belong to that matrix.
 * If no distance matrix is found for the pathogen, no action is taken.
 *
 * @param pathogen_id - The ID of the pathogen for which distances should be deleted.
 */
export const deleteDistancesByPathogenId = async (pathogen_id: number) => {
    const distanceMatrixForPathogen = await db.distance_matrices.where({ pathogen_id: pathogen_id }).first();
    if (distanceMatrixForPathogen) {
        await db.distances.where({ distance_matrix_id: distanceMatrixForPathogen.id }).delete();
    }
};

/**
 * Deletes all distances where either case_id_1 or case_id_2 matches the provided case_id.
 *
 * @param case_id - The ID of the case for which distances should be deleted.
 */
export const deleteDistancesByCaseId = async (case_id: number) => {
    await db.distances.where({ case_id_1: case_id }).or("case_id_2").equals(case_id).delete();
};

/**
 * Retrieves all distances where either case_id_1 or case_id_2 is included in the provided caseIds array,
 * and the distance value is less than or equal to the specified threshold.
 *
 * @param caseIds - An array of case IDs to filter distances by.
 * @param threshold - The maximum distance value to include in the results.
 * @returns A promise that resolves to an array of distances matching the criteria.
 */
export const getDistancesFromCaseIdsBelowThreshold = async (caseIds: number[], threshold: number) => {
    const distances = await db.distances.toArray();

    return distances.filter((distance) => {
        const { case_id_1, case_id_2, value } = distance;
        return (caseIds.includes(case_id_1) || caseIds.includes(case_id_2)) && value <= threshold;
    });
};
