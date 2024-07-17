import { z } from "zod";

export interface OutbreakSchema {
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export const outbreakRules = z.object({
    name: z.string().min(1),
});
