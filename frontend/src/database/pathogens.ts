import { PathogenTypeName } from "./pathogen_types";

export const Pathogens = {
    "Covid-19": PathogenTypeName.virus,
    "Test-1": PathogenTypeName.bacteria,
    "Test-2": PathogenTypeName.bacteria,
};

export interface PathogenSchema {
    id: number;
    name: string;
    pathogen_type_id: number;
    activated_at: string | null;
    created_at?: Date;
    updated_at?: Date;
}
