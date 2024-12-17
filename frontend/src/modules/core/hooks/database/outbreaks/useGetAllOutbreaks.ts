import { db } from "@/modules/core/services/database/DatabaseManager";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllOutbreaks = () => {
    return useLiveQuery(() =>
        db.outbreaks.toArray().then((outbreaks) => outbreaks.sort((a, b) => a.name.localeCompare(b.name)))
    );
};
