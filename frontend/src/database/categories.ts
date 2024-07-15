import { z } from "zod";

export interface CategorySchema {
    id: number;
    name: string;
    updated_at: Date;
}

export const categoryRules = z.object({
    name: z.string().min(1),
    updated_at: z.date(),
});
