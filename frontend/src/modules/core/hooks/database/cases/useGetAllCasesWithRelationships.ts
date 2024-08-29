import { CaseWithRelationships, getAllCasesWithRelationships } from "@/modules/core/models/cases";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCasesWithRelationships = (): CaseWithRelationships[] | undefined => {
    return useLiveQuery(() => getAllCasesWithRelationships());
};
