import { z } from "zod";
import { CategorySchema } from "./categories";
import { db } from "./db";

export interface GroupSchema {
    id: number;
    name: string;
    category_id: number;
    pathogen_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface GroupWithRelationships extends GroupSchema {
    category?: CategorySchema | null;
}

export type GroupWithCategory = GroupSchema & { categoryName: string | undefined };

export const groupRules = z.object({
    name: z.string().min(1),
    category_id: z.number(),
    pathogen_id: z.number(),
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

export const getGroupsForPathogenId = async (pathogenId: number) => {
    const groups = await db.groups.where({ pathogen_id: pathogenId }).toArray();
    return groups.sort((a, b) => a.name.localeCompare(b.name));
};
