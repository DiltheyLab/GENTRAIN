import { z } from "zod";
import { db } from "./db";
import { groupContactsForCase } from "@/services/cases";

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

export const getContactsByCaseId = async (caseId: number) => {
    const caseContacts = await db.contacts.where({ case_id_1: caseId }).or("case_id_2").equals(caseId).toArray();
    const groupedContacts = await groupContactsForCase(caseId, caseContacts);
    return groupedContacts;
};
