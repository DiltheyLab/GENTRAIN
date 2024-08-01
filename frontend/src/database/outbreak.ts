import { z } from "zod";
import { db } from "./db";

export interface OutbreakSchema {
    id: number;
    name: string;
    pathogen_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

export const outbreakRules = z.object({
    name: z.string().min(1),
    pathogen_id: z.number(),
});

export const getOutbreaksForPathogenId = async (pathogenId: number) => {
    const outbreaksForPathogen = await db.outbreaks
        .where({ pathogen_id: pathogenId })
        .toArray()
        .then((outbreaks) => outbreaks.sort((a, b) => a.name.localeCompare(b.name)));
    return outbreaksForPathogen;
};
