import { db } from "@/modules/core/services/database/DatabaseManager";
import { useLiveQuery } from "dexie-react-hooks";
export const useGetAllGroups = () => {
    return useLiveQuery(() => db.groups.toArray());
};
