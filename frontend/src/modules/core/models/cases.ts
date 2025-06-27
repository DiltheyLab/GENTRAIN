import { z } from "zod";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { PathogenSchema } from "./pathogens";
import { OutbreakSchema } from "./outbreaks";
import { getGroupsByIdsWithRelationships, GroupSchema, GroupWithRelationships } from "./groups";
import { collectContactsForCases, GroupedContacts } from "./contacts";
import { SequenceAnalysisSchema } from "./sequence_analyses";
import { Collection } from "dexie";
import { useCoreStore } from "../stores/core";
import { deleteDistancesByCaseId } from "./distances";

export interface CaseSchema {
    id: number;
    case_id: string;
    fasta_id: string | null;
    pathogen_id: number;
    outbreak_id: number | null;
    group_ids: Array<number>;
    street: string | null;
    zip_code: string | null;
    city: string | null;
    first_name: string | null;
    last_name: string | null;
    infected_by: string | null;
    registered_at: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface CaseWithRelationships extends CaseSchema {
    sequence_analysis?: SequenceAnalysisSchema | null;
    pathogen?: PathogenSchema | null;
    outbreak?: OutbreakSchema | null;
    groups?: GroupWithRelationships[] | null;
    contacts?: GroupedContacts | null;
}

export type CaseImport = {
    case_id?: string;
    fasta_id: string | null;
    groups: { name: string; category: string; remaining?: boolean }[];
    outbreak: string | null;
    infected_by: string | null;
    street: string | null;
    zip_code: string | null;
    city: string | null;
    first_name: string | null;
    last_name: string | null;
    registered_at: Date;
};

export const caseImportRules = z.object({
    fasta_id: z.string().min(1).or(z.null()),
    outbreak: z.string().or(z.null()),
    infected_by: z.string().min(1).or(z.null()),
    groups: z.array(z.object({ name: z.string(), category: z.string(), remaining: z.boolean().or(z.undefined()) })),
    street: z.string().or(z.null()),
    zip_code: z.string().min(5).max(5).or(z.null()),
    city: z.string().or(z.null()),
    first_name: z.string().or(z.null()),
    last_name: z.string().or(z.null()),
    registered_at: z.date(),
});

export const caseRules = z.object({
    case_id: z.string().min(1),
    fasta_id: z.string().min(1).or(z.null()),
    pathogen_id: z.number(),
    outbreak_id: z.number().or(z.null()),
    infected_by: z.string().min(1).or(z.null()),
    group_ids: z.array(z.number()),
    street: z.string().or(z.null()),
    zip_code: z.string().min(5).max(5).or(z.null()),
    city: z.string().or(z.null()),
    first_name: z.string().or(z.null()),
    last_name: z.string().or(z.null()),
    registered_at: z.date(),
});

export const getAllCases = async () => {
    const cases = await db.cases.toArray();
    return cases;
};

export const getSequenceAnalysis = async (fastaId: string) => {
    const activePathogen = useCoreStore.getState().activePathogen;
    if (!activePathogen) return null;
    const pathogenSequenceAnalyses = await db.sequence_analyses.where({ pathogen_id: activePathogen.id }).toArray();
    const pathogenSequenceAnalyisIds = pathogenSequenceAnalyses.map((sequenceAnalysis) => sequenceAnalysis.id);
    const sequenceAnalysisMapping = await db.sequence_analyses_cases
        .where({ fasta_id: fastaId })
        .filter((sequenceAnalysisMapping) =>
            pathogenSequenceAnalyisIds.includes(sequenceAnalysisMapping.sequence_analysis_id)
        )
        .first();
    if (!sequenceAnalysisMapping) return null;
    const sequenceAnalysis = await db.sequence_analyses
        .where({ id: sequenceAnalysisMapping.sequence_analysis_id })
        .first();
    return sequenceAnalysis;
};

export const getWithRelations = async (collection: Collection, includeSequenceAnalysisResult = false) => {
    const cases = await collection.toArray();

    let casesWithRelationships: { [caseId: number]: CaseWithRelationships } = {};

    for (const currentCase of cases) {
        const caseWithRelationships: CaseWithRelationships = currentCase;
        // retrieve sequence analysis schema object
        if (includeSequenceAnalysisResult && currentCase.fasta_id) {
            caseWithRelationships.sequence_analysis = await getSequenceAnalysis(currentCase.fasta_id);
        }
        // retrieve outbreak schema object
        if (currentCase.outbreak_id) {
            const outbreak = await db.outbreaks.where({ id: currentCase.outbreak_id }).first();
            if (outbreak) {
                caseWithRelationships.outbreak = outbreak;
            }
        }
        // retrieve group schema objects
        if (currentCase.group_ids.length > 0) {
            const groups: GroupSchema[] = await getGroupsByIdsWithRelationships(currentCase.group_ids);
            caseWithRelationships.groups = groups;
        }
        casesWithRelationships[currentCase.id] = caseWithRelationships;
    }

    casesWithRelationships = await collectContactsForCases(casesWithRelationships);

    return Object.values(casesWithRelationships);
};

export const getCasesByConditionWithRelationships = async (
    where: string,
    equals: any,
    includeSequenceAnalysisResult = false
) => {
    const cases = await db.cases.where(where).equals(equals).toArray();

    let casesWithRelationships: { [caseId: number]: CaseWithRelationships } = {};

    for (const currentCase of cases) {
        const caseWithRelationships: CaseWithRelationships = currentCase;
        // retrieve sequence analysis schema object
        if (includeSequenceAnalysisResult && currentCase.fasta_id) {
            caseWithRelationships.sequence_analysis = await getSequenceAnalysis(currentCase.fasta_id);
        }
        // retrieve outbreak schema object
        if (currentCase.outbreak_id) {
            const outbreak = await db.outbreaks.where({ id: currentCase.outbreak_id }).first();
            if (outbreak) {
                caseWithRelationships.outbreak = outbreak;
            }
        }
        // retrieve group schema objects
        if (currentCase.group_ids.length > 0) {
            const groups: GroupSchema[] = await getGroupsByIdsWithRelationships(currentCase.group_ids);
            caseWithRelationships.groups = groups;
        }
        casesWithRelationships[currentCase.id] = caseWithRelationships;
    }

    casesWithRelationships = await collectContactsForCases(casesWithRelationships);

    return Object.values(casesWithRelationships);
};

export const getAllCasesForPathogenWithRelationships = async (pathogen_id: number) => {
    const cases = await db.cases.where({ pathogen_id: pathogen_id }).toArray();

    let casesWithRelationships: { [caseId: number]: CaseWithRelationships } = {};

    // retrieve pathogen schema object
    const pathogen = await db.pathogens.where({ id: pathogen_id }).first();

    for (const currentCase of cases) {
        const caseWithRelationships: CaseWithRelationships = currentCase;
        caseWithRelationships.pathogen = pathogen;
        // retrieve sequence analysis schema object
        if (currentCase.fasta_id) {
            caseWithRelationships.sequence_analysis = await getSequenceAnalysis(currentCase.fasta_id);
        }

        // retrieve outbreak schema object
        if (currentCase.outbreak_id) {
            const outbreak = await db.outbreaks.where({ id: currentCase.outbreak_id }).first();
            if (outbreak) {
                caseWithRelationships.outbreak = outbreak;
            }
        }
        // retrieve group schema objects
        if (currentCase.group_ids.length > 0) {
            const groups: GroupSchema[] = await getGroupsByIdsWithRelationships(currentCase.group_ids);
            caseWithRelationships.groups = groups;
        }
        casesWithRelationships[currentCase.id] = caseWithRelationships;
    }

    casesWithRelationships = await collectContactsForCases(casesWithRelationships);
    return Object.values(casesWithRelationships);
};

export const getCaseByCaseId = async (caseId: string) => {
    const caseByCaseId = await db.cases.where({ case_id: caseId }).first();
    return caseByCaseId;
};

export const getCaseByFastaId = async (fastaId: string) => {
    const caseByFastaId = await db.cases.where({ fasta_id: fastaId }).first();
    return caseByFastaId;
};

export const getCasesForPathogenWithSequenceAnalysis = async (pathogen_id: number) => {
    const pathogenCases = await db.cases.where({ pathogen_id: pathogen_id }).toArray();

    const casesWithRelationships: CaseWithRelationships[] = [];
    for (const pathogenCase of pathogenCases) {
        const caseWithRelationships: CaseWithRelationships = pathogenCase;
        if (pathogenCase.fasta_id) {
            if (pathogenCase.fasta_id) {
                caseWithRelationships.sequence_analysis = await getSequenceAnalysis(pathogenCase.fasta_id);
            }
            casesWithRelationships.push(caseWithRelationships);
        }
    }
    return casesWithRelationships;
};

export const deleteCaseById = async (id: number) => {
    const caseData = await db.cases.get(id);
    if (!caseData) return;
    if (caseData?.fasta_id) {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (activePathogen) {
            const pathogenSequenceAnalyses = await db.sequence_analyses
                .where({ pathogen_id: activePathogen.id })
                .toArray();
            const pathogenSequenceAnalyisIds = pathogenSequenceAnalyses.map((sequenceAnalysis) => sequenceAnalysis.id);
            await db.sequence_analyses_cases
                .where({ fasta_id: caseData?.fasta_id })
                .filter((sequenceAnalysisMapping) =>
                    pathogenSequenceAnalyisIds.includes(sequenceAnalysisMapping.sequence_analysis_id)
                )
                .delete();
        }
    }
    await deleteDistancesByCaseId(id);
    await db.cases.delete(id);
};

export type CaseToUpdate = {
    key: number;
    changes: Partial<CaseSchema>;
};
export const bulkUpdateCases = (casesToUpdate: CaseToUpdate[]) => {
    return db.cases.bulkUpdate(casesToUpdate);
};
