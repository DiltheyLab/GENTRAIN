import { db } from "@/database/db";
import { PathogenTypeSchema } from "@/database/pathogen_types";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllPathogenTypes = (): PathogenTypeSchema[] | undefined => {
    return useLiveQuery(() => db.pathogen_types.toArray());
};
