import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";
export const useGetAllGroups = () => {
    return useLiveQuery(() => db.groups.toArray());
};
