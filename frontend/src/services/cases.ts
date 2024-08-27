import { CaseSchema, deleteCaseById, getCaseWithSampleById } from "@/database/cases";
import { ContactForCase, ContactSchema, GroupedContacts } from "@/database/contacts";
import { db } from "@/database/db";
import { getOrCreateDistanceMatrixIdByPathogenId } from "@/database/distance_matrices";
import { deleteDistancesBySampleId } from "@/database/distances";
import { deleteSampleById } from "@/database/samples";
import { useAppStore } from "@/stores/app";

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

const extractContactDataForCase = async (contact: ContactSchema, caseId: number, cases: Map<number, CaseSchema>) => {
    if (contact.case_id_1 === caseId) {
        const contactCase = cases.get(contact.case_id_2);
        const contactForCase = {
            id: contact.id,
            case_id: contactCase?.case_id,
            type: contact.type,
            context: contact.context,
            created_at: contact.created_at,
            updated_at: contact.updated_at,
        } as ContactForCase;
        return contactForCase;
    }
    const contactCase = cases.get(contact.case_id_1);
    const contactForCase = {
        id: contact.id,
        case_id: contactCase?.case_id,
        type: contact.type,
        context: contact.context,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
    } as ContactForCase;
    return contactForCase;
};

export const groupContactsForCase = async (
    caseId: number,
    contacts: ContactSchema[],
    cases: Map<number, CaseSchema>
) => {
    const groupedContacts: GroupedContacts = {};
    for (const contact of contacts) {
        const contactForCase = await extractContactDataForCase(contact, caseId, cases);
        if (!(contactForCase.case_id in groupedContacts)) {
            groupedContacts[contactForCase.case_id] = [];
        }
        groupedContacts[contactForCase.case_id].push({ type: contactForCase.type, context: contactForCase.context });
    }
    const groupedAndSortedContacts = Object.keys(groupedContacts)
        .sort()
        .reduce((sortedContacts: GroupedContacts, key: string) => {
            sortedContacts[key] = groupedContacts[key];
            return sortedContacts;
        }, {});

    return groupedAndSortedContacts;
};
