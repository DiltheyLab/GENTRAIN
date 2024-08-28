import { CaseWithRelationships, getAllCasesWithRelationships } from "@/database/cases";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCasesWithRelationships = (): CaseWithRelationships[] | undefined => {
    return useLiveQuery(() => getAllCasesWithRelationships());
};
