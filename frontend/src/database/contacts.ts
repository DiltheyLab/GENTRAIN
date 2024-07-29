import { z } from "zod";

export interface ContactSchema {
    id: number;
    case_id_1: number;
    case_id_2: number;
    type: string;
    context: string;
    created?: Date;
    updated_at?: Date;
}

export const contactRules = z.object({
    case_id_1: z.number(),
    case_id_2: z.number(),
    type: z.string(),
    context: z.string(),
});
