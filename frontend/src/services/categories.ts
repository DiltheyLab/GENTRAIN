import { categoryRules, CategorySchema } from "@/database/categories";
import { db } from "@/database/db";
import { groupRules, GroupSchema } from "@/database/groups";

/**
 * Returns names of flexible categories of a case from csv columns.
 *
 * @param data
 * @returns
 */
export const getFlexibleCategoryNames = (data: Array<Array<string>>) => {
    const flexibleCategoryName1 = data[0][4];
    const flexibleCategoryName2 = data[0][5];
    const flexibleCategoryName3 = data[0][6];
    return [flexibleCategoryName1, flexibleCategoryName2, flexibleCategoryName3];
};

const createGroupIfNotExist = async (groupName: string, categoryId: number, pathogenId: number) => {
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

const createCategory = async (categoryName: string, pathogenId: number) => {
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
const persistCategoryIfNotExist = async (categoryName: string, pathogenId: number) => {
    const existingCategoryForName = await db.categories.where({ name: categoryName }).first();
    const categoryId = existingCategoryForName
        ? existingCategoryForName.id
        : await createCategory(categoryName, pathogenId);
    return categoryId;
};

/**
 * Create categories and grourps for a single case.
 *x
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
        collectCategoryData(flexibleCategoryNames[0], caseData[7]),
        collectCategoryData(flexibleCategoryNames[1], caseData[8]),
        collectCategoryData(flexibleCategoryNames[2], caseData[9]),
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

/**
 * Reads groups as array from comma-separated string.
 *
 * @param categoryData
 * @returns
 */
const parseCategoryGroups = (categoryData: string) => {
    return categoryData.split(",");
};

/**
 * Creates and returns an object with a categorys name and its corresponding groups.
 *
 * @param name
 * @param data
 * @returns
 */
const collectCategoryData = (name: string, data: string) => {
    if (!data) {
        return;
    }
    return { name: name, groups: parseCategoryGroups(data) };
};
