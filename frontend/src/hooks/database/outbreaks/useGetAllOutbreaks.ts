import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllOutbreaks = () => {
    return useLiveQuery(() => db.outbreaks.toArray());
};
