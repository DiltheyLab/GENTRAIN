import { CaseSchema, getCaseByFastaId } from "@/modules/core/models/cases";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetCaseByFastaId = (fastaId: string): CaseSchema | undefined => {
    return useLiveQuery(() => getCaseByFastaId(fastaId));
};
