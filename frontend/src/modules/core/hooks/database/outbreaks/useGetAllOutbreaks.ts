import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllOutbreaks = () => {
    return useLiveQuery(() =>
        db.outbreaks.toArray().then((outbreaks) => outbreaks.sort((a, b) => a.name.localeCompare(b.name)))
    );
};
