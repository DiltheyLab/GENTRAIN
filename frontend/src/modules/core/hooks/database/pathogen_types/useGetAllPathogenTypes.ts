import { db } from "@/modules/core/infrastructure/database";
import { getAllPathogenTypesWithRelationships } from "@/modules/core/models/pathogen_types";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetAllPathogenTypes = () => {
    return useLiveQuery(() => getAllPathogenTypesWithRelationships());
};

export const useGetPathogenTypeByName = (pathogenTypeName: string) => {
    return useLiveQuery(() => db.pathogen_types.where({ name: pathogenTypeName }).first());
};
