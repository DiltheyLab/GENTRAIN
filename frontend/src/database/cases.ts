import { z } from "zod";
import { db } from "./db";
import { deleteSampleById, SampleSchema } from "./samples";
import { PathogenSchema } from "./pathogens";
import { OutbreakSchema } from "./outbreaks";
import { getGroupsByIdsWithRelationships, GroupSchema, GroupWithRelationships } from "./groups";
import { useAppStore } from "@/stores/app";
import { getOrCreateDistanceMatrixIdByPathogenId } from "./distance_matrices";
import { deleteDistancesBySampleId } from "./distances";
import { getContactsByCaseId, GroupedContacts } from "./contacts";

export interface CaseSchema {
    id: number;
    case_id: string;
    fasta_id: string | null;
    pathogen_id: number;
    outbreak_id: number | null;
    group_ids: Array<number>;
    registered_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface CaseWithRelationships extends CaseSchema {
    sample?: SampleSchema | null;
    pathogen?: PathogenSchema | null;
    outbreak?: OutbreakSchema | null;
    groups?: GroupWithRelationships[] | null;
    contacts?: GroupedContacts | null;
}

export const caseRules = z.object({
    case_id: z.string().min(1),
    fasta_id: z.string().min(1).or(z.null()),
    pathogen_id: z.number(),
    outbreak_id: z.number().or(z.null()),
    group_ids: z.array(z.number()),
    registered_at: z.date(),
});

export const getAllCases = async () => {
    const cases = await db.cases.toArray();
    return cases;
};

export const getAllCasesWithRelationships = async () => {
    const cases = await db.cases.toArray();
    let casesWithRelationships: CaseWithRelationships[] = [];
    for (const key in cases) {
        casesWithRelationships[key] = cases[key];
        // retrieve pathogen schema object
        const pathogen = await db.pathogens.where({ id: cases[key].pathogen_id }).first();
        casesWithRelationships[key].pathogen = pathogen;
        // retrieve sample schema object
        if (cases[key].fasta_id) {
            const sample = await db.samples.where({ fasta_id: cases[key].fasta_id }).first();
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
        // retrieve group schema objects
        if (cases[key].group_ids.length > 0) {
            const groups: GroupSchema[] = await getGroupsByIdsWithRelationships(cases[key].group_ids);
            casesWithRelationships[key].groups = groups;
        }
    }
    return casesWithRelationships;
};

export const getAllCasesForPathogenWithRelationships = async (pathogen_id: number) => {
    const cases = await db.cases.where({ pathogen_id: pathogen_id }).toArray();
    let casesWithRelationships: CaseWithRelationships[] = [];
    for (const key in cases) {
        casesWithRelationships[key] = cases[key];
        // retrieve pathogen schema object
        const pathogen = await db.pathogens.where({ id: cases[key].pathogen_id }).first();
        casesWithRelationships[key].pathogen = pathogen;
        // retrieve sample schema object
        if (cases[key].fasta_id) {
            const sample = await db.samples.where({ fasta_id: cases[key].fasta_id }).first();
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
        // retrieve group schema objects
        if (cases[key].group_ids.length > 0) {
            const groups: GroupSchema[] = await getGroupsByIdsWithRelationships(cases[key].group_ids);
            casesWithRelationships[key].groups = groups;
        }
        const contacts = await getContactsByCaseId(cases[key].id);
        if (Object.keys(contacts).length > 0) {
            casesWithRelationships[key].contacts = contacts;
        }
    }
    return casesWithRelationships;
};

export const getCaseByFastaId = async (fastaId: string) => {
    const caseByFastaId = await db.cases.where({ fasta_id: fastaId }).first();
    return caseByFastaId;
};

export const getCaseWithSampleById = async (id: number) => {
    const caseById = await db.cases.get(id);
    if (!caseById) {
        return;
    }
    let caseWithRelationships: CaseWithRelationships = caseById;
    caseWithRelationships.sample = await db.samples.where({ fasta_id: caseById.fasta_id }).first();
    return caseWithRelationships;
};

export const getCasesForPathogenWithSample = async (pathogen_id: number) => {
    const pathogenCases = await db.cases.where({ pathogen_id: pathogen_id }).toArray();

    const casesWithRelationships: CaseWithRelationships[] = [];
    for (const pathogenCase of pathogenCases) {
        let caseWithRelationships: CaseWithRelationships = pathogenCase;
        if (pathogenCase.fasta_id) {
            caseWithRelationships.sample = await db.samples.where({ fasta_id: pathogenCase.fasta_id }).first();
            casesWithRelationships.push(caseWithRelationships);
        }
    }
    return casesWithRelationships;
};

export const deleteCaseById = async (id: number) => {
    await db.cases.delete(id);
};

export const deleteCasebyIdAndRecalculateDistances = async (id: number) => {
    const activePathogen = useAppStore.getState().activePathogen;
    if (activePathogen) {
        await db.transaction("rw", db.cases, db.samples, db.distances, db.distance_matrices, async () => {
            const distanceMatrixId = await getOrCreateDistanceMatrixIdByPathogenId(activePathogen.id);
            const caseWithSample = await getCaseWithSampleById(id);
            if (caseWithSample && distanceMatrixId) {
                await deleteCaseById(id);
            }
            if (caseWithSample?.sample) {
                await deleteSampleById(caseWithSample?.sample.id);
            }
            if (caseWithSample?.sample) {
                await deleteDistancesBySampleId(caseWithSample?.sample.id);
            }
        });
    }
};
