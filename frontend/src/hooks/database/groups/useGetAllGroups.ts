import { db } from "@/database/db";
import { GroupSchema } from "@/database/groups";
import { useLiveQuery } from "dexie-react-hooks";
export const useGetAllGroups = () => {
    return useLiveQuery(() => db.groups.toArray());
};

export type GroupWithCategory = GroupSchema & { categoryName: string | undefined };

export const useGetAllGroupsAndOutbreaks = () => {
    return useLiveQuery(async () => {
        //get groups with categories
        const groups = (await db.groups.toArray()).sort((a, b) => a.name.localeCompare(b.name));
        const groupsWithCategories: GroupWithCategory[] = await Promise.all(
            groups.map(async (group) => {
                const category = await db.categories.get(group.category_id);
                const categoryName = category?.name;
                return { ...group, categoryName };
            })
        );

        //get outbreaks
        const outbreaks = (await db.outbreaks.toArray()).sort((a, b) => a.name.localeCompare(b.name));

        //check for cases without outbreak
        const cases = await db.cases.toArray();
        const casesWithoutOutbreakExist = cases.some((c) => c.outbreak_id === null);

        return { outbreaks, groupsWithCategories, casesWithoutOutbreakExist };
    });
};
