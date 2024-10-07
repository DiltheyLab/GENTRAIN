import { toast } from "@/modules/core/components/ui/UseToast";
import { db } from "@/modules/core/infrastructure/database";
import { CaseSchema } from "@/modules/core/models/cases";
import { ContactSchema, contactRules } from "@/modules/core/models/contacts";
import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export class ContactsPersistence extends PersistenceStrategy {
    protected persist = async () => {
        const bulkData = [] as ContactSchema[];
        const contactUploads = useDataManagementStore.getState().contactUploads;
        // create Set of caseIds to fetch them from the database
        const caseIds = new Set<string>();
        for (const contactId of Object.keys(contactUploads)) {
            const contact = contactUploads[contactId];
            caseIds.add(contact.case_id_1);
            caseIds.add(contact.case_id_2);
        }

        const cases = await db.cases.where("case_id").anyOf(Array.from(caseIds)).toArray();

        // create lookup table to improve performance
        // fetching single cases in a loop is very unefficent with indexedDB
        const casesMap = new Map<string, CaseSchema>();
        for (const caseData of cases) {
            casesMap.set(caseData.case_id, caseData);
        }

        for (const contactId of Object.keys(contactUploads)) {
            const contact = contactUploads[contactId];

            const case1 = casesMap.get(contact.case_id_1);
            const case2 = casesMap.get(contact.case_id_2);

            if (!case1 || !case2 || !contact.upload) {
                continue;
            }

            // Validate the data and throw an error if it is invalid
            const dto = contactRules.parse({
                case_id_1: case1.id,
                case_id_2: case2.id,
                type: contact.type,
                context: contact.context,
            }) as ContactSchema;
            bulkData.push(dto);
        }
        // Bulk add the data to the database
        await db.contacts.bulkAdd(bulkData);
        useDataManagementStore.getState().setContactSelectionActive(false);
        useDataManagementStore.getState().clearContactUploads();
        toast({
            title: "Datei wurde erfolgreich hochgeladen",
            duration: 5000,
            variant: "success",
        });
    };

    protected update = async () => {};
}
