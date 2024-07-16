import { z } from "zod";

export interface CategorySchema {
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export const categoryRules = z.object({
    name: z.string().min(1),
});
