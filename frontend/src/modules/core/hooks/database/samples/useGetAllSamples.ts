import { SequenceAnalysisSchema } from "@/modules/core/models/sequence_analyses";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllSequenceAnalyses = (): SequenceAnalysisSchema[] | undefined => {
    return useLiveQuery(() => db.sequence_analyses.toArray());
};
