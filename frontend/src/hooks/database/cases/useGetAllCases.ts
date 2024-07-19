import { CaseSchema, getAllCases } from "@/database/cases";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCases = (): CaseSchema[] | undefined => {
    return useLiveQuery(() => getAllCases());
};
