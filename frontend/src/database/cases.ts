import { z } from "zod";
import { db } from "./db";
import { SampleSchema } from "./samples";
import { PathogenSchema } from "./pathogens";
import { OutbreakSchema } from "./outbreak";

export interface CaseSchema {
    id?: number;
    case_id: string;
    sample_id: string | null;
    pathogen_id: number;
    outbreak_id: number;
    groups: Array<number>;
    registered_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface CaseWithRelationships extends CaseSchema {
    sample?: SampleSchema | null;
    pathogen?: PathogenSchema | null;
    outbreak?: OutbreakSchema | null;
}

export const caseRules = z.object({
    case_id: z.string().min(1),
    sample_id: z.string().min(1).or(z.null()),
    pathogen_id: z.number(),
    outbreak_id: z.number(),
    groups: z.array(z.number()),
    registered_at: z.date(),
});

export const getAllCasesWithRelationships = async () => {
    const cases = await db.cases.toArray();
    let casesWithRelationships: CaseWithRelationships[] = [];
    for (const key in cases) {
        casesWithRelationships[key] = cases[key];
        // retrieve pathogen schema object
        const pathogen = await db.pathogens.where({ id: cases[key].pathogen_id }).first();
        casesWithRelationships[key].pathogen = pathogen;
        // retrieve sample schema object
        if (cases[key].sample_id) {
            const sample = await db.samples.where({ fasta_id: cases[key].sample_id }).first();
            if (sample) {
                casesWithRelationships[key].sample = sample;
            }
        }
        // retrieve outbreak schema object
        if (cases[key].outbreak_id) {
            const outbreak = await db.outbreaks.where({ id: cases[key].outbreak_id }).first();
            if (outbreak) {
                casesWithRelationships[key].outbreak = outbreak;
            }
        }
    }
    return casesWithRelationships;
};
