import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./db";

export enum PathogenTypeName {
    bacteria,
    virus,
}

export interface PathogenTypeSchema {
    id: number;
    name: PathogenTypeName;
    updated_at: string;
}

export const usePathogenTypesGetAll = (): PathogenTypeSchema[] | undefined => {
    return useLiveQuery(() => db.pathogen_types.toArray());
};
