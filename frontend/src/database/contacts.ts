import { z } from "zod";
import { db } from "./db";
import { groupContactsForCase } from "@/services/cases";
import { CaseSchema, CaseWithRelationships } from "./cases";

export interface ContactSchema {
    id: number;
    case_id_1: number;
    case_id_2: number;
    type: string;
    context: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface ContactForCase {
    id: number;
    case_id: string;
    type: string;
    context: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface GroupedContacts {
    [caseId: string]: { type: string; context: string }[];
}

export const contactRules = z.object({
    case_id_1: z.number(),
    case_id_2: z.number(),
    type: z.string(),
    context: z.string(),
});

export const getContactsByCaseId = async (caseId: number, cases: Map<number, CaseSchema>) => {
    const caseContacts = await db.contacts.where({ case_id_1: caseId }).or("case_id_2").equals(caseId).toArray();
    const groupedContacts = await groupContactsForCase(caseId, caseContacts, cases);
    return groupedContacts;
};

export const addContactForCases = (
    case1: CaseWithRelationships,
    case2: CaseWithRelationships,
    type: string,
    context: string
) => {
    // add contact entry to first case contact object
    const groupedContacts1 = case1.contacts ?? {};
    if (!(case2.id in groupedContacts1)) {
        groupedContacts1[case2.id] = [];
    }
    groupedContacts1[case2.id].push({ type: type, context: context });
    case1.contacts = groupedContacts1;
    // add contact entry to second case contact object
    const groupedContacts2 = case2.contacts ?? {};
    if (!(case1.id in groupedContacts2)) {
        groupedContacts2[case1.id] = [];
    }
    groupedContacts2[case1.id].push({ type: type, context: context });
    case2.contacts = groupedContacts2;
    return [case1, case2];
};
