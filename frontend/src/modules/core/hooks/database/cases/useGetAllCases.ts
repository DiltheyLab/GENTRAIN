import { CaseSchema, getAllCases } from "@/modules/core/models/cases";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCases = (): CaseSchema[] | undefined => {
    return useLiveQuery(() => getAllCases());
};
