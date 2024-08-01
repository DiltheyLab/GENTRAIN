import { useAppStore } from "@/stores/app";
import { db } from "./db";
import { PathogenSchema } from "./pathogens";

export enum PathogenTypeName {
    bacteria,
    virus,
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
        // retrieve pathogen schema object
        const pathogens = await db.pathogens.where({ pathogen_type_id: pathogenTypes[key].id }).toArray();
        pathogenTypesWithRelationships[key].pathogens = pathogens;
    }
    return pathogenTypesWithRelationships;
};

export const getPathogenTypeForActivePathogen = async () => {
    const activePathogen = useAppStore.getState().activePathogen;
    if (!activePathogen) {
        return;
    }
    const pathogenType = await db.pathogen_types.get(activePathogen.pathogen_type_id);
    return pathogenType;
};
