import { db } from "@/database/db";
import { getAllPathogenTypesWithRelationships } from "@/database/pathogen_types";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllPathogenTypes = () => {
    return useLiveQuery(() => getAllPathogenTypesWithRelationships());
};

export const useGetPathogenTypeByName = (pathogenTypeName: string) => {
    return useLiveQuery(() => db.pathogen_types.where({ name: pathogenTypeName }).first());
};
