import { db } from "@/database/db";
import { getGroupsForPathogenId } from "@/database/groups";
import { getOutbreaksForPathogenId } from "@/database/outbreak";
import { useAppStore } from "@/stores/app";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllGroupsAndOutbreaksForActivePathogen = () => {
    const activePathogen = useAppStore.getState().activePathogen;
    return useLiveQuery(async () => {
        if (!activePathogen) {
            return;
        }
        //get groups, sort them alphabetically and add the category name
        const groups = await getGroupsForPathogenId(activePathogen.id);
        const groupsWithCategories = await Promise.all(
            groups.map(async (group) => {
                const category = await db.categories.get(group.category_id);
                const categoryName = category?.name;
                return { ...group, categoryName };
            })
        );

        //get outbreaks and sort them alphabetically
        const outbreaks = await getOutbreaksForPathogenId(activePathogen.id);

        const cases = await db.cases.toArray();
        //check for cases without outbreak (not possible in indexedDB because null is not a indexable type)
        const casesWithoutOutbreakExist = cases.some((c) => c.outbreak_id === null);

        return { outbreaks, groupsWithCategories, casesWithoutOutbreakExist };
    }, [activePathogen]);
};
