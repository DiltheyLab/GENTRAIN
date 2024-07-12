import { db } from "@/database/db";
import { PathogenSchema } from "@/database/pathogens";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllPathogens = (): PathogenSchema[] | undefined => {
    return useLiveQuery(() => db.pathogens.toArray());
};
