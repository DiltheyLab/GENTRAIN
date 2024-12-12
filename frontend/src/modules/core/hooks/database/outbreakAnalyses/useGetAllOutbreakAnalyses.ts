import { db } from "@/modules/core/services/database/DatabaseManager";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllOutbreakAnalyses = () => {
    return useLiveQuery(() => db.analyses.toArray());
};
