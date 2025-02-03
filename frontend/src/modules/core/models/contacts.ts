import { z } from "zod";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { CaseSchema, CaseWithRelationships } from "./cases";
import { t } from "i18next";

export interface ContactSchema {
    id: number;
    case_id_1: number;
    case_id_2: number;
    type: string;
    context: string;
    created_at?: Date;
    updated_at?: Date;
}

export type ContactImport = {
    contact_id?: string;
    case_id_1: string;
    case_id_2: string;
    type: string;
    context: string;
};

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

export const addContactForCases = (
    case1: CaseWithRelationships,
    case2: CaseWithRelationships,
    type: string,
    context: string
) => {
    // add contact entry to first case contact object
    const groupedContacts1 = case1.contacts ?? {};
    if (!(case2.case_id in groupedContacts1)) {
        groupedContacts1[case2.case_id] = [];
    }
    groupedContacts1[case2.case_id].push({ type: type, context: context });
    case1.contacts = groupedContacts1;
    // add contact entry to second case contact object
    const groupedContacts2 = case2.contacts ?? {};
    if (!(case1.case_id in groupedContacts2)) {
        groupedContacts2[case1.case_id] = [];
    }
    groupedContacts2[case1.case_id].push({ type: type, context: context });
    case2.contacts = groupedContacts2;
    return [case1, case2];
};

export const collectContactsForCases = async (casesWithRelationships: { [caseId: number]: CaseWithRelationships }) => {
    const contacts = await db.contacts.toArray();
    for (const contact of contacts) {
        if (contact.case_id_1 in casesWithRelationships && contact.case_id_2 in casesWithRelationships) {
            [casesWithRelationships[contact.case_id_1], casesWithRelationships[contact.case_id_2]] = addContactForCases(
                casesWithRelationships[contact.case_id_1],
                casesWithRelationships[contact.case_id_2],
                contact.type,
                contact.context
            );
        }
    }
    return casesWithRelationships;
};

export const getContactsOfType = async (type: string) => {
    const contactsOfType = await db.contacts.where({ type: type }).toArray();
    return contactsOfType;
};

export const createContactsFromAddressesAndLastNames = async (addressAndLastNameMap: Map<string, number[]>) => {
    const contacts: { case_id_1: number; case_id_2: number; type: string; context: string }[] = [];
    const contactsOfType = await getContactsOfType(t("import:contact_types.same_address_and_last_name"));
    addressAndLastNameMap.forEach(async (caseIdsWithSameAddressAndLastname) => {
        if (caseIdsWithSameAddressAndLastname.length < 2) {
            return;
        }
        for (let index1 = 0; index1 < caseIdsWithSameAddressAndLastname.length; index1++) {
            for (let index2 = 0; index2 < index1; index2++) {
                const caseId1 = caseIdsWithSameAddressAndLastname[index1];
                const caseId2 = caseIdsWithSameAddressAndLastname[index2];
                if (contactExistsInContactsOfType(contactsOfType, caseId1, caseId2)) continue;
                contacts.push({
                    case_id_1: caseId1,
                    case_id_2: caseId2,
                    type: t("import:contact_types.same_address_and_last_name"),
                    context: "",
                });
            }
        }
    });
    await db.contacts.bulkAdd(contacts);
};

export const createContactsFromAddresses = async (
    addressMap: Map<string, number[]>,
    caseMap: Map<number, CaseSchema>
) => {
    const contacts: { case_id_1: number; case_id_2: number; type: string; context: string }[] = [];
    const contactsOfType = await getContactsOfType(t("import:contact_types.same_address"));
    // create same last name contacts if a last name is bound to multiple cases
    addressMap.forEach((caseIdsWithSameAddress) => {
        if (caseIdsWithSameAddress.length < 2) return;
        for (let index1 = 0; index1 < caseIdsWithSameAddress.length; index1++) {
            for (let index2 = 0; index2 < index1; index2++) {
                const caseId1 = caseIdsWithSameAddress[index1];
                const case1 = caseMap.get(caseId1);
                const caseId2 = caseIdsWithSameAddress[index2];
                const case2 = caseMap.get(caseId2);

                if (
                    case1?.last_name === case2?.last_name ||
                    contactExistsInContactsOfType(contactsOfType, caseId1, caseId2)
                ) {
                    continue;
                }

                contacts.push({
                    case_id_1: caseId1,
                    case_id_2: caseId2,
                    type: t("import:contact_types.same_address"),
                    context: "",
                });
            }
        }
    });
    await db.contacts.bulkAdd(contacts);
};

export const contactExistsInContactsOfType = (
    contactsOfType: ContactSchema[],
    case_id_1: number,
    case_id_2: number
) => {
    return (
        contactsOfType.filter(
            (contact) =>
                (contact.case_id_1 === case_id_1 && contact.case_id_2 === case_id_2) ||
                (contact.case_id_1 === case_id_2 && contact.case_id_2 === case_id_1)
        ).length > 0
    );
};
