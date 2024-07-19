import { z } from "zod";
import { db } from "./db";
import { GroupSchema } from "./groups";

export interface CategorySchema {
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface CategoriesWithGroups extends CategorySchema {
    groups?: GroupSchema[] | null;
}

export const categoryRules = z.object({
    name: z.string().min(1),
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
