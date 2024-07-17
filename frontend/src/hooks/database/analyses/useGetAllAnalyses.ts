import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllAnalyses = () => {
    return useLiveQuery(() => db.analyses.toArray());
};
