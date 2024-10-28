import { db } from "@/modules/core/infrastructure/database";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";

export enum PathogenTypeName {
    bacterial = "bacterial",
    viral = "viral",
}
export interface PathogenTypeSchema {
    id: number;
    name: PathogenTypeName;
    initialized_at: Date | null;
    created_at?: Date;
    updated_at?: Date;
}

export interface PathogenTypeWithRelationships extends PathogenTypeSchema {
    pathogens?: PathogenSchema[] | null;
}

export const getAllPathogenTypesWithRelationships = async () => {
    const pathogenTypes = await db.pathogen_types.toArray();
    let pathogenTypesWithRelationships: PathogenTypeWithRelationships[] = [];
    for (const key in pathogenTypes) {
        pathogenTypesWithRelationships[key] = pathogenTypes[key];
        const pathogens = await db.pathogens.where({ pathogen_type_id: pathogenTypes[key].id }).toArray();
        let pathogensWithRelationships: PathogenWithRelationships[] = [];
        for (const key in pathogens) {
            pathogensWithRelationships[key] = pathogens[key];
            // retrieve pathogen schema object
            const pathogenType = await db.pathogen_types.where({ id: pathogens[key].pathogen_type_id }).first();
            pathogensWithRelationships[key].pathogen_type = pathogenType;
        }
        pathogenTypesWithRelationships[key].pathogens = pathogensWithRelationships;
    }
    return pathogenTypesWithRelationships;
};

export const getPathogenTypeForPathogen = async (pathogen: PathogenSchema) => {
    const pathogenType = await db.pathogen_types.get(pathogen.pathogen_type_id);
    return pathogenType;
};

export const setInitializedAtForPathogenType = async (pathogenTypeId: number) => {
    await db.pathogen_types.update(pathogenTypeId, {
        initialized_at: new Date(),
    });
};
