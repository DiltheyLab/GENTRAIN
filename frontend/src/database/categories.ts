import { z } from "zod";
import { db } from "./db";
import { GroupSchema } from "./groups";

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

export const deleteCategoriesByPathogenId = async (pathogen_id: number) => {
    await db.categories.where({ pathogen_id: pathogen_id }).delete();
};
