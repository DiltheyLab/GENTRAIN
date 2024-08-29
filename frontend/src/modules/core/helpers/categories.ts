/**
 * Reads groups as array from comma-separated string.
 *
 * @param categoryData
 * @returns
 */
export const parseCategoryGroups = (categoryData: string) => {
    return categoryData.split(",");
};

/**
 * Creates and returns an object with a categorys name and its corresponding groups.
 *
 * @param name
 * @param data
 * @returns
 */
export const collectCategoryData = (name: string, data: string) => {
    if (!data) {
        return;
    }
    return { name: name, groups: parseCategoryGroups(data) };
};

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
