import { useLiveQuery } from "dexie-react-hooks";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";
import { db } from "./db";

export const Pathogens = {
    "Covid-19": PathogenTypeName.virus,
    "Test-1": PathogenTypeName.bacteria,
    "Test-2": PathogenTypeName.bacteria,
};

export interface PathogenSchema {
    id: number;
    name: string;
    pathogen_type_id: number;
    updated_at: string;
}

export const usePathogensGetAll = (): PathogenSchema[] | undefined => {
    return useLiveQuery(() => db.pathogens.toArray());
};

export const getPathogensGroupedByTypes = async (pathogenTypes: PathogenTypeSchema[]) => {
    const pathogenByTypes = await pathogenTypes?.map(async (pathogenType) => {
        const pathogensForType = await db.pathogens.where({ pathogen_type_id: pathogenType.id }).toArray();
        return pathogensForType;
    });
    return pathogenByTypes;
};
