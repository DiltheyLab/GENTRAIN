import { db } from "@/core/infrastructure/database";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllAnalyses = () => {
    return useLiveQuery(() => db.analyses.toArray());
};
