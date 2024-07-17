import { PathogenTypeName } from "./pathogen_types";

export const Pathogens = {
    "Covid-19": { type: PathogenTypeName.virus, relationshop_threshold: 15 },
    "Test-1": { type: PathogenTypeName.bacteria, relationshop_threshold: 20 },
    "Test-2": { type: PathogenTypeName.bacteria, relationshop_threshold: 10 },
};

export interface PathogenSchema {
    id: number;
    name: string;
    relationship_threshold: number;
    pathogen_type_id: number;
    activated_at: string | null;
    created_at?: Date;
    updated_at?: Date;
}
