import { db } from "@/modules/core/infrastructure/database";
import { PathogenSchema, PathogenWithRelationships } from "@/modules/core/models/pathogens";
import { useCoreStore } from "@/modules/core/stores/core";

export enum PathogenTypeName {
    bacterial = "bacterial",
    viral = "viral",
}
export interface PathogenTypeSchema {
    id: number;
    name: PathogenTypeName;
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

export const getPathogenTypeForActivePathogen = async () => {
    const activePathogen = useCoreStore.getState().activePathogen;
    if (!activePathogen) {
        return;
    }
    const pathogenType = await db.pathogen_types.get(activePathogen.pathogen_type_id);
    return pathogenType;
};
