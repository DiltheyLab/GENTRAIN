import { z } from "zod";

export interface ContactSchema {
    id: number;
    case_id_1: string;
    case_id_2: string;
    type: string;
    context: string;
    created?: Date;
    updated_at?: Date;
}

export const contactRules = z.object({
    case_id_1: z.string().min(1),
    case_id_2: z.string().min(1),
    type: z.string(),
    context: z.string(),
});
