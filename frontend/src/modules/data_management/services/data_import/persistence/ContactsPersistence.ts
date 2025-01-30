import {toast} from "@/modules/core/components/ui/UseToast";
import {db} from "@/modules/core/services/database/DatabaseManager";
import {ContactSchema, contactRules} from "@/modules/core/models/contacts";
import {ObjectRelationalMapper} from "@/modules/core/services/database/ObjectRelationalMapper";
import {useDataManagementStore} from "@/modules/data_management/stores/dataManagement";
import {PersistenceStrategy} from "./PersistenceStrategy";

export class ContactsPersistence extends PersistenceStrategy {
    protected persist = async () => {
        const bulkData = [] as ContactSchema[];
        const contactImports = useDataManagementStore.getState().contactImports;
        // create Set of caseIds to fetch them from the database
        const caseIds = new Set<string>();
        for (const contactId of Object.keys(contactImports)) {
            const contact = contactImports[contactId];
            caseIds.add(contact.imported.case_id_1);
            caseIds.add(contact.imported.case_id_2);
        }

        const cases = await db.cases.where("case_id").anyOf(Array.from(caseIds)).toArray();
        const casesMap = ObjectRelationalMapper.arrayToMap(cases, "case_id");

        for (const contactId of Object.keys(contactImports)) {
            const contact = contactImports[contactId];

            const case1 = casesMap.get(contact.imported.case_id_1);
            const case2 = casesMap.get(contact.imported.case_id_2);

            if (!case1 || !case2 || !contact.import) {
                continue;
            }

            // Validate the data and throw an error if it is invalid
            const dto = contactRules.parse({
                case_id_1: case1.id,
                case_id_2: case2.id,
                type: contact.imported.type,
                context: contact.imported.context,
            }) as ContactSchema;
            bulkData.push(dto);
        }
        // Bulk add the data to the database
        await db.contacts.bulkAdd(bulkData);
        useDataManagementStore.getState().setContactSelectionActive(false);
        useDataManagementStore.getState().clearContactImports();
        if (!useDataManagementStore.getState().showImportAssistent) {
            toast({
                title: "Datei wurde erfolgreich hochgeladen",
                duration: 5000,
                variant: "success",
            });
        }
        useDataManagementStore.getState().resetImportAssistent(true);
    };

    protected update = async () => {
    };
}
