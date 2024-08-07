import { deleteAnalysesByPathogenId } from "./analyses";
import { deleteCategoriesByPathogenId } from "./categories";
import { db } from "./db";
import { getDistanceMatrixByPathogenId } from "./distance_matrices";
import { deleteGroupsByPathogenId } from "./groups";
import { deleteOutbreaksByPathogenId } from "./outbreaks";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";

export const Pathogens = {
    "Covid-19": { type: PathogenTypeName.virus, geneticDistanceThreshold: 2 },
    "Test-1": { type: PathogenTypeName.bacteria, geneticDistanceThreshold: 20 },
    "Test-2": { type: PathogenTypeName.bacteria, geneticDistanceThreshold: 10 },
};

export interface PathogenSchema {
    id: number;
    name: string;
    genetic_distance_threshold: number;
    pathogen_type_id: number;
    activated_at: string | null;
    created_at?: Date;
    updated_at?: Date;
}

export interface PathogenWithRelationships extends PathogenSchema {
    pathogen_type?: PathogenTypeSchema | null;
}

export const getAllPathogensWithRelationships = async () => {
    const cases = await db.pathogens.toArray();
    let pathogensWithRelationships: PathogenWithRelationships[] = [];
    for (const key in cases) {
        pathogensWithRelationships[key] = cases[key];
        // retrieve pathogen schema object
        const pathogenType = await db.pathogen_types.where({ pathogenid: cases[key].pathogen_type_id }).first();
        pathogensWithRelationships[key].pathogen_type = pathogenType;
    }
    return pathogensWithRelationships;
};

export const deleteDataForPathogen = async (pathogen_id: number) => {
    await db.transaction(
        "rw",
        [
            db.cases,
            db.samples,
            db.contacts,
            db.cases,
            db.distances,
            db.distance_matrices,
            db.outbreaks,
            db.categories,
            db.groups,
            db.analyses,
        ],
        async () => {
            const distanceMatrix = await getDistanceMatrixByPathogenId(pathogen_id);
            const cases = await db.cases.where({ pathogen_id: pathogen_id }).toArray();
            const deletions = [];
            for (const caseData of cases) {
                if (caseData.fasta_id) {
                    deletions.push(db.samples.where({ fasta_id: caseData.fasta_id }).delete());
                }
                deletions.push(
                    db.contacts.where({ case_id_1: caseData.id }).or("case_id_2").equals(caseData.id).delete()
                );
                deletions.push(db.cases.where({ id: caseData.id }).delete());
            }
            if (distanceMatrix?.id) {
                deletions.push(db.distances.where({ distance_matrix_id: distanceMatrix.id }).delete());
                deletions.push(db.distance_matrices.where({ id: distanceMatrix.id }).delete());
            }
            deletions.push(deleteOutbreaksByPathogenId(pathogen_id));
            deletions.push(deleteCategoriesByPathogenId(pathogen_id));
            deletions.push(deleteGroupsByPathogenId(pathogen_id));
            deletions.push(deleteAnalysesByPathogenId(pathogen_id));

            await Promise.all(deletions);
        }
    );
};
