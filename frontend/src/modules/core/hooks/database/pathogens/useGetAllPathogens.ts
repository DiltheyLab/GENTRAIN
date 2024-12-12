import { db } from "@/modules/core/services/database/DatabaseManager";
import { PathogenSchema } from "@/modules/core/models/pathogens";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllPathogens = (): PathogenSchema[] | undefined => {
    return useLiveQuery(() => db.pathogens.toArray());
};
