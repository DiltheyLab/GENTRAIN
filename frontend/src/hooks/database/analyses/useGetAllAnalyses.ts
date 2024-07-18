import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllAnalyses = () => {
    return useLiveQuery(() => db.analyses.toArray());
};

export const useGetAnalysisByID = (id: number | undefined) => {
    return useLiveQuery(() => db.analyses.get(id || -1), [id]);
};
