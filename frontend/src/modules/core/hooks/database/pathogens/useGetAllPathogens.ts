import { db } from "@/core/infrastructure/database";
import { PathogenSchema } from "@/modules/core/models/pathogens";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllPathogens = (): PathogenSchema[] | undefined => {
    return useLiveQuery(() => db.pathogens.toArray());
};
