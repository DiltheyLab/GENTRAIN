import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";
export const useGetAllGroups = () => {
    return useLiveQuery(() => db.groups.toArray());
};

export const useGetAllGroupsAndOutbreaks = () => {
    return useLiveQuery(async () => {
        const groups = (await db.groups.toArray()).sort((a, b) => a.name.localeCompare(b.name));
        const outbreaks = (await db.outbreaks.toArray()).sort((a, b) => a.name.localeCompare(b.name));
        return { outbreaks, groups };
    });
};
