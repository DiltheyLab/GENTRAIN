import { CaseSchema } from "@/database/cases";
import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllCases = (): CaseSchema[] | undefined => {
    return useLiveQuery(() => db.cases.toArray());
};
