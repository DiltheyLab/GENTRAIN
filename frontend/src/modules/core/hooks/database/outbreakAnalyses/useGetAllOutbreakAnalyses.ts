import { db } from "@/modules/core/infrastructure/database";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllOutbreakAnalyses = () => {
    return useLiveQuery(() => db.analyses.toArray());
};
