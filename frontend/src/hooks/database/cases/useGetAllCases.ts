import { CaseWithRelationships, getAllCasesWithRelationships } from "@/database/cases";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCases = (): CaseWithRelationships[] | undefined => {
    return useLiveQuery(() => getAllCasesWithRelationships());
};
