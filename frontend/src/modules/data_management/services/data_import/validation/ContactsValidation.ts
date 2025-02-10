import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { CaseSchema } from "@/modules/core/models/cases";
import { ValidationStrategy } from "./ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ContactImport, ContactSchema } from "@/modules/core/models/contacts";
import { toast } from "@/modules/core/components/ui/UseToast";
import { useCoreStore } from "@/modules/core/stores/core";
import { t } from "i18next";

const COLUMNS = {
    index_case_id: { required: true, names: ["IndexFall_Token", "Fall ID 1"] },
    other_case_id: { required: true, names: ["Fall", "Fall ID 2"] },
};

export class ContactsValidation extends ValidationStrategy {
    protected header: string[] = [];
    protected data: { [key: string]: string }[] = [];

    public collectData(data: { columns: string[]; rows: { [key: string]: string }[] }) {
        this.header = data.columns;
        this.data = data.rows;
    }

    protected validate = async () => {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        //check if header is exactly the same as columnNameRequirements
        if (!this.isHeaderValid(COLUMNS)) {
            throw new GentrainException("InvalidHeaderError");
        }

        const cases = await db.cases.where({ pathogen_id: activePathogen.id }).toArray();
        const caseMap = new Map<string, CaseSchema>();
        for (const caseData of cases) {
            caseMap.set(caseData.case_id, caseData);
        }

        const contactImports = await this.filterAlreadyExistingContact(this.data, caseMap);
        useDataManagementStore.getState().setContactImports(contactImports);
        useDataManagementStore.getState().setContactSelectionActive(true);

        if (Object.keys(contactImports).length === 0) {
            toast({
                title: "Die ausgewählte Datei enthält keine neuen Kontaktangaben.",
                duration: 5000,
                variant: "default",
            });
        } else {
            if (useDataManagementStore.getState().showImportAssistent) {
                useDataManagementStore.getState().nextImportAssistentStep();
            }
        }

        return {
            data: this.data,
        };
    };

    private filterAlreadyExistingContact = async (
        data: { [key: string]: string }[],
        cases: Map<string, CaseSchema>
    ) => {
        // we use a set to achieve bidirectionally unique contact edges
        const contactSet: Set<string> = new Set();
        for (const index in data) {
            const contact = data[index];
            const case1 = this.getCellValueForColumn(contact, COLUMNS.index_case_id);
            const case2 = this.getCellValueForColumn(contact, COLUMNS.other_case_id);
            if (!case1 || !case2) continue;
            const indexCase = cases.get(case1);
            const otherCase = cases.get(case2);
            if (!indexCase || !otherCase) continue;

            const existingContact = await db.contacts
                .where("[case_id_1+case_id_2+type]")
                .equals([indexCase.id, otherCase.id, t("import:contact_types.contact_person")])
                .first();

            // don't add contact to contact set if a db entry exists already
            if (existingContact) {
                continue;
            }

            // we sort cases alphabetically to add case pairs only once
            contactSet.add(JSON.stringify([case1, case2].sort() as [string, string]));
        }
        return this.collectContactsFromUniqueSet(contactSet);
    };

    private collectContactsFromUniqueSet(contactSet: Set<string>) {
        const contactImports: {
            [id: string]: { imported: ContactImport; persisted: ContactSchema | null; import: boolean };
        } = {};
        const contacts = Array.from(contactSet);
        // iterate over the set and collect contacts to import
        for (const index in contacts) {
            const contact = JSON.parse(contacts[index]);
            contactImports[index] = {
                imported: {
                    contact_id: index,
                    case_id_1: contact[0],
                    case_id_2: contact[1],
                    type: t("import:contact_types.contact_person"),
                    context: "",
                } as ContactImport,
                persisted: null,
                import: true,
            };
        }
        return contactImports;
    }
}
