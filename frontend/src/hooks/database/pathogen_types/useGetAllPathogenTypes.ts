import { db } from "@/database/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllPathogenTypes = () => {
    return useLiveQuery(() => db.pathogen_types.toArray());
};

export const useGetPathogenTypeByName = (pathogenTypeName: string) => {
    return useLiveQuery(() => db.pathogen_types.where({ name: pathogenTypeName }).first());
};
