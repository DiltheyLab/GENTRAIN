import { z } from "zod";
import { CategorySchema } from "./categories";
import { db } from "./db";

export interface GroupSchema {
    id: number;
    name: string;
    category_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface GroupWithRelationships extends GroupSchema {
    category?: CategorySchema | null;
}

export const groupRules = z.object({
    name: z.string().min(1),
    category_id: z.number(),
});

export const getGroupsByIdsWithRelationships = async (group_ids: number[]) => {
    const groups = await db.groups.where("id").anyOf(group_ids).toArray();
    let groupsWithRelationships: GroupWithRelationships[] = [];
    for (const key in groups) {
        groupsWithRelationships[key] = groups[key];
        // retrieve category schema object
        const category = await db.categories.where({ id: groups[key].category_id }).first();
        groupsWithRelationships[key].category = category;
    }
    return groupsWithRelationships;
};

export const getCaseBySampleId = async (fastaId: string) => {
    const caseBySampleId = await db.cases.where({ sample_id: fastaId }).first();
    return caseBySampleId;
};
