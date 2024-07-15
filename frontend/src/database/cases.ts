import { z } from "zod";
import { db } from "./db";

export interface CaseSchema {
    id?: number;
    case_id: string;
    sample_id: string | null;
    pathogen_id: number;
    groups: Array<number>;
    registered_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

export const caseRules = z.object({
    case_id: z.string().min(1),
    sample_id: z.string().min(1).or(z.null()),
    pathogen_id: z.number(),
    groups: z.array(z.number()),
    registered_at: z.date(),
});

export const getAllCases = () => {
    return db.cases.toArray();
};
