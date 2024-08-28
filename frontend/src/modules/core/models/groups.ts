import { z } from "zod";
import { CategorySchema, persistCategoryIfNotExist } from "@/modules/core/models/categories";
import { db } from "@/core/infrastructure/database";
import { collectCategoryData } from "@/modules/core/helpers/categories";

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

export const deleteGroupsByPathogenId = async (pathogen_id: number) => {
    await db.groups.where({ pathogen_id: pathogen_id }).delete();
};

export const createGroupIfNotExist = async (groupName: string, categoryId: number, pathogenId: number) => {
    const existingGroupForName = await db.groups.where({ name: groupName }).first();
    const data = {
        name: groupName,
        category_id: categoryId,
        pathogen_id: pathogenId,
    } as GroupSchema;

    // Validate the data and throw an error if it is invalid
    const dto = groupRules.parse(data) as GroupSchema;
    const groupId = existingGroupForName ? existingGroupForName.id : await db.groups.add(dto);
    return groupId;
};

/**
 * Create categories and grourps for a single case.
 *
 * @param flexibleCategoryNames
 * @param caseData
 * @returns
 */
export const persistGroupsForCategories = async (
    flexibleCategoryNames: Array<string>,
    caseData: Array<string>,
    pathogenId: number
) => {
    let groups = [];
    for (const category of [
        collectCategoryData(flexibleCategoryNames[0], caseData[4]),
        collectCategoryData(flexibleCategoryNames[1], caseData[5]),
        collectCategoryData(flexibleCategoryNames[2], caseData[6]),
    ]) {
        if (!category) {
            continue;
        }
        const categoryId = await persistCategoryIfNotExist(category.name, pathogenId);
        for (const group of category.groups) {
            groups.push(await createGroupIfNotExist(group, categoryId, pathogenId));
        }
    }
    return groups;
};
