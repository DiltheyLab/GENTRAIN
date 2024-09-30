import { db } from "@/modules/core/infrastructure/database";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetOutbreakAnalysisById = (id: string) => {
    return useLiveQuery(() => db.analyses.get(+id), [id]);
};
