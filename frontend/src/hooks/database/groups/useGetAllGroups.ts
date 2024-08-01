import { db } from "@/database/db";
import { GroupSchema } from "@/database/groups";
import { useLiveQuery } from "dexie-react-hooks";
export const useGetAllGroups = () => {
    return useLiveQuery(() => db.groups.toArray());
};

export type GroupWithCategory = GroupSchema & { categoryName: string | undefined };

export const useGetAllGroupsAndOutbreaks = () => {
    return useLiveQuery(async () => {
        //get groups, sort them alphabetically and add the category name
        const groups = (await db.groups.toArray()).sort((a, b) => a.name.localeCompare(b.name));
        const groupsWithCategories = await Promise.all(
            groups.map(async (group) => {
                const category = await db.categories.get(group.category_id);
                const categoryName = category?.name;
                return { ...group, categoryName };
            })
        );

        //get outbreaks and sort them alphabetically
        const outbreaks = (await db.outbreaks.toArray()).sort((a, b) => a.name.localeCompare(b.name));

        const cases = await db.cases.toArray();
        //check for cases without outbreak (not possible in indexedDB because null is not a indexable type)
        const casesWithoutOutbreakExist = cases.some((c) => c.outbreak_id === null);

        return { outbreaks, groupsWithCategories, casesWithoutOutbreakExist };
    });
};
