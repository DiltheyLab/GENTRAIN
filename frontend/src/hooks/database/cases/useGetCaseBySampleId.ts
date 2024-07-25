import { CaseSchema, getCaseBySampleId } from "@/database/cases";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetCaseBySampleId = (fastaId: string): CaseSchema | undefined => {
    return useLiveQuery(() => getCaseBySampleId(fastaId));
};
