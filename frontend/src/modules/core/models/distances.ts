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

export const getAllDistancesForDistanceMatrixWithCaseReferences = async (distanceMatrixId: number) => {
    const distances = await db.distances.where({ distance_matrix_id: distanceMatrixId }).toArray();
    let distancesWithFastaIds = [];

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

export const deleteDistancesByPathogenId = async (pathogen_id: number) => {
    const distanceMatrixForPathogen = await db.distance_matrices.where({ pathogen_id: pathogen_id }).first();
    if (distanceMatrixForPathogen) {
        await db.distances.where({ distance_matrix_id: distanceMatrixForPathogen.id }).delete();
    }
};

export const deleteDistancesBySampleId = async (sample_id: number) => {
    await db.distances.where({ sample_id_1: sample_id }).or("sample_id_2").equals(sample_id).delete();
};

export const getDistancesFromSequenceAnalysisIdsBelowThreshold = async (caseIds: number[], threshold: number) => {
    const distances = await db.distances.toArray();
    return distances.filter((distance) => {
        const { case_id_1, case_id_2, value } = distance;
        return (caseIds.includes(case_id_1) || caseIds.includes(case_id_2)) && value <= threshold;
    });
};
