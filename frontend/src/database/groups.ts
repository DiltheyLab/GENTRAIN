import { z } from "zod";

export interface GroupSchema {
    id: number;
    name: string;
    category_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export const groupRules = z.object({
    name: z.string().min(1),
    category_id: z.number(),
});
