import { z } from "zod";
import { db } from "@/modules/core/infrastructure/database";
import { getGroupCaseCount, getGroupSequencedCaseCount, GroupSchema } from "./groups";

export interface CategorySchema {
    id: number;
    name: string;
    pathogen_id: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface CategoriesWithGroups extends CategorySchema {
    groups?: GroupSchema[] | null;
}

export const categoryRules = z.object({
    name: z.string().min(1),
    pathogen_id: z.number(),
});

export const getAllCategoriesWithGroups = async () => {
    const categories = await db.categories.toArray();
    let categoriesWithGroups: CategoriesWithGroups[] = [];
    for (const key in categories) {
        categoriesWithGroups[key] = categories[key];
        // retrieve groups schema object
        const groups = await db.groups.where({ category_id: categories[key].id }).toArray();
        categoriesWithGroups[key].groups = groups;
    }
    return categoriesWithGroups;
};

export const getCategoriesWithGroupsAndCaseCountForActivePathogen = async (pathogenId: number) => {
    const categories = await db.categories.where({ pathogen_id: pathogenId }).toArray();
    let categoriesWithGroups: CategoriesWithGroups[] = [];
    for (const key in categories) {
        categoriesWithGroups[key] = categories[key];
        // retrieve groups schema object
        const groups = await db.groups.where({ category_id: categories[key].id }).toArray();
        categoriesWithGroups[key].groups = groups;
        categoriesWithGroups[key].groups.map(async (group) => {
            group.case_count = await getGroupCaseCount(group.id);
            group.sequenced_case_count = await getGroupSequencedCaseCount(group.id);
            return group;
        });
    }
    return categoriesWithGroups;
};

export const deleteCategoriesByPathogenId = async (pathogen_id: number) => {
    await db.categories.where({ pathogen_id: pathogen_id }).delete();
};

export const createCategory = async (categoryName: string, pathogenId: number) => {
    const data = {
        name: categoryName,
        pathogen_id: pathogenId,
    } as CategorySchema;
    // Validate the data and throw an error if it is invalid
    const dto = categoryRules.parse(data) as CategorySchema;
    const categoryId = await db.categories.add(dto);
    return categoryId;
};

/**
 * Persists a category in the database if it does not exist. Returns the corresponding id.
 *
 * @param categoryName
 * @returns
 */
export const persistCategoryIfNotExist = async (categoryName: string, pathogenId: number) => {
    const existingCategoryForName = await db.categories.where({ name: categoryName }).first();
    const categoryId = existingCategoryForName
        ? existingCategoryForName.id
        : await createCategory(categoryName, pathogenId);
    return categoryId;
};
