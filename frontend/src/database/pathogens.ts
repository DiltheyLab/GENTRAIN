import { db } from "./db";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";

export const Pathogens = {
    "Covid-19": { type: PathogenTypeName.virus, relationshop_threshold: 15 },
    MRSA: { type: PathogenTypeName.bacteria, relationshop_threshold: 20 },
    VRE: { type: PathogenTypeName.bacteria, relationshop_threshold: 10 },
};

export interface PathogenSchema {
    id: number;
    name: string;
    relationship_threshold: number;
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
