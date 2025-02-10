import { toast } from "@/modules/core/components/ui/UseToast";
import { db } from "@/modules/core/services/database/DatabaseManager";
import {
    ContactImport,
    ContactSchema,
    contactRules,
    createContactsFromAddresses,
    createContactsFromAddressesAndLastNames,
} from "@/modules/core/models/contacts";
import { ObjectRelationalMapper } from "@/modules/core/services/database/ObjectRelationalMapper";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { PersistenceStrategy } from "./PersistenceStrategy";
import { CaseSchema } from "@/modules/core/models/cases";
import { t } from "i18next";

export class ContactsPersistence extends PersistenceStrategy {
    protected persist = async () => {
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

        // Bulk add the data to the database
        await db.contacts.bulkAdd(this.collectContactImports(contactImports, casesMap));

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

    public static async createSameAddressAndLastnameContactsForCases(caseMap: Map<number, CaseSchema>) {
        const addressAndLastNameMap = new Map<string, number[]>();
        // map case ids by addresses and last names
        caseMap.forEach((currentCase) => {
            if (!currentCase.zip_code || !currentCase.city || !currentCase.street || !currentCase.last_name) return;
            const key =
                `${currentCase.zip_code}_${currentCase.city}_${currentCase.street}_${currentCase.last_name}`.replace(
                    " ",
                    "-"
                );
            addressAndLastNameMap.set(key, [currentCase.id, ...(addressAndLastNameMap.get(key) ?? [])]);
        });
        await createContactsFromAddressesAndLastNames(addressAndLastNameMap);
    }

    public static async createSameAddressAndDifferentLastnameContactsForCases(caseMap: Map<number, CaseSchema>) {
        const addressMap = new Map<string, number[]>();
        // map case ids by last names
        caseMap.forEach((currentCase) => {
            if (!currentCase.zip_code || !currentCase.city || !currentCase.street) return;
            const key = `${currentCase.zip_code}_${currentCase.city}_${currentCase.street}`.replace(" ", "-");
            addressMap.set(key, [currentCase.id, ...(addressMap.get(key) ?? [])]);
        });
        await createContactsFromAddresses(addressMap, caseMap);
    }

    public static async removeCaseBasedContactsForActivePathogen(caseMap: Map<string, number>, pathogenId: number) {
        const caseIds = (await db.cases.where({ pathogen_id: pathogenId }).toArray())
            .filter((currentCase: CaseSchema) => caseMap.has(currentCase.case_id))
            .map((currentCase) => {
                return currentCase.id;
            });

        await db.contacts
            .where("case_id_1")
            .anyOf(caseIds)
            .or("case_id_2")
            .anyOf(caseIds)
            .and(
                (contact) =>
                    contact.type === t("import:contact_types.same_address_and_last_name") ||
                    contact.type === t("import:contact_types.same_address") ||
                    contact.type === t("import:contact_types.infected_by")
            )
            .delete();
    }

    private collectContactImports(
        contactImports: {
            [id: string]: {
                imported: ContactImport;
                persisted: ContactSchema | null;
                import: boolean;
            };
        },
        casesMap: Map<string, CaseSchema>
    ) {
        const bulkData = [] as ContactSchema[];
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
        return bulkData;
    }
}
