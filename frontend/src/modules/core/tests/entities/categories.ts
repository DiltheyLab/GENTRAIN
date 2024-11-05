import { CategorySchema } from "../../models/categories";
import { GroupSchema } from "../../models/groups";
import { createGroup, createGroups } from "./groups";

type TestCategory = Partial<CategorySchema>;

export const createCategory = ({
    id = 0,
    name = ":category_name:",
    pathogen_id = 0,
    created_at = new Date(),
    updated_at = new Date(),
}: TestCategory = {}) => {
    return {
        id: id,
        name: name,
        pathogen_id: pathogen_id,
        created_at: created_at,
        updated_at: updated_at,
    } as CategorySchema;
};

export const createCategoriesAndGroups = (amount = 1) => {
    let categories: CategorySchema[] = [];
    let groups: GroupSchema[] = [];
    for (let i = 0; i < amount; i++) {
        const category = createCategory({
            id: i,
            name: `:category_${i}:`,
        });
        categories = [...categories, category];
        groups = [...groups, ...createGroups({ category_id: category.id })];
    }

    return { categories, groups };
};

export const createCategoryAndGroup = (
    categoryName: string = ":category_name:",
    groupName: string = ":group_name:"
) => {
    const category = createCategory({
        name: categoryName,
    });
    const group = createGroup({ name: groupName });

    return { category, group };
};
