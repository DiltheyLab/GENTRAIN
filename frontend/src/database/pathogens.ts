import { useLiveQuery } from "dexie-react-hooks";
import { PathogenTypeName, PathogenTypeSchema } from "./pathogen_types";
import { db } from "./db";
import Dexie from "dexie";

export const Pathogens = {
    "Covid-19": PathogenTypeName.virus,
    "Test-1": PathogenTypeName.bacteria,
    "Test-2": PathogenTypeName.bacteria,
};

export interface PathogenSchema {
    id: number;
    name: string;
    pathogen_type_id: number;
    pathogen_type?: PathogenTypeSchema;
    updated_at: string;
}

export const usePathogensGetAll = (): PathogenSchema[] | undefined => {
    return useLiveQuery(() => db.pathogens.toArray());
};
