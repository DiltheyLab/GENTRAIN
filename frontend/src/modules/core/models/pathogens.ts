import { deleteAnalysesByPathogenId } from "./analyses";
import { deleteCategoriesByPathogenId } from "./categories";
import { db } from "@/modules/core/infrastructure/database";
import { getDistanceMatrixByPathogenId } from "./distance_matrices";
import { deleteGroupsByPathogenId } from "./groups";
import { deleteOutbreaksByPathogenId } from "./outbreaks";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";
import { gentrainApi } from "../main";

export type Pathogen = {
    id: number;
    name: string;
    type: PathogenTypeName;
    genetic_distance_threshold: number;
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

export const fetchPathogensFromServer = async () => {
    const pathogens: Pathogen[] = await gentrainApi.getAllPathogens();
    return pathogens;
};

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
            db.samples,
            db.sequence_analyses,
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
                    const sampleCollection = db.samples.where({ fasta_id: caseData.fasta_id });
                    sampleCollection.each((sample) => {
                        if (sample.sequence_analysis_id) {
                            deletions.push(db.sequence_analyses.where({ id: sample.sequence_analysis_id }).delete());
                        }
                    });
                    deletions.push(sampleCollection.delete());
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
