import { deleteAnalysesByPathogenId } from "./analyses";
import { deleteCategoriesByPathogenId } from "./categories";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { getDistanceMatrixByPathogenId } from "./distance_matrices";
import { deleteGroupsByPathogenId } from "./groups";
import { deleteOutbreaksByPathogenId } from "./outbreaks";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";
import gentrainApiInstance from "../adapters/GentrainApi";
import { getSequenceAnalysis } from "./cases";

export type Pathogen = {
    id: number;
    name: string;
    cases_example: string | null;
    sequences_example: string | null;
    contacts_example: string | null;
    type: PathogenTypeName;
    genetic_distance_threshold: number;
};

export interface PathogenSchema {
    id: number;
    name: string;
    genetic_distance_threshold: number;
    pathogen_type_id: number;
    cases_example: string | null;
    sequences_example: string | null;
    contacts_example: string | null;
    activated_at: string | null;
    created_at?: Date;
    updated_at?: Date;
}

export interface PathogenWithRelationships extends PathogenSchema {
    pathogen_type?: PathogenTypeSchema | null;
}

export const getAllPathogensWithRelationships = async () => {
    const pathogens = await db.pathogens.toArray();
    let pathogensWithRelationships: PathogenWithRelationships[] = [];
    for (const key in pathogens) {
        pathogensWithRelationships[key] = pathogens[key];
        // retrieve pathogen schema object
        const pathogenType = await db.pathogen_types.where({ id: pathogens[key].pathogen_type_id }).first();
        pathogensWithRelationships[key].pathogen_type = pathogenType;
    }
    return pathogensWithRelationships;
};

export const deleteDataForPathogen = async (pathogen_id: number) => {
    await db.transaction(
        "rw",
        [
            db.cases,
            db.sequence_analyses,
            db.sequence_analyses_cases,
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
                    const sequence_analysis = await getSequenceAnalysis(caseData.fasta_id);
                    if (sequence_analysis) {
                        deletions.push(db.sequence_analyses.where({ id: sequence_analysis.id }).delete());
                    }
                    deletions.push(await db.sequence_analyses_cases.where({ fasta_id: caseData.fasta_id }).delete());
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
