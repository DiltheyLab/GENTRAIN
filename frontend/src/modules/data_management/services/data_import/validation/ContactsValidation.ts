import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/infrastructure/database";
import { CaseSchema } from "@/modules/core/models/cases";
import { ValidationStrategy } from "./ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ContactImport, ContactSchema } from "@/modules/core/models/contacts";
import { toast } from "@/modules/core/components/ui/UseToast";

const CONTACT_COLUMN_NAMES = ["Fall ID 1", "Fall ID 2", "Typ", "Kontext"];

export class ContactsValidation extends ValidationStrategy {
    protected validate = async (data: string[][]) => {
        const activePathogen = this.coreState.activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        const header = data[0];
        data = data.slice(1, data.length);

        //check if header is exactly the same as columnNameRequirements
        if (!this.isHeaderValid(header, CONTACT_COLUMN_NAMES)) {
            throw new GentrainException("InvalidHeaderError");
        }

        const cases = await db.cases.where({ pathogen_id: activePathogen.id }).toArray();
        const caseMap = new Map<string, CaseSchema>();
        for (const caseData of cases) {
            caseMap.set(caseData.case_id, caseData);
        }

        const contactImports = await this.filterAlreadyExistingContact(data, caseMap);
        useDataManagementStore.getState().setContactImports(contactImports);
        useDataManagementStore.getState().setContactSelectionActive(true);
        if (useDataManagementStore.getState().showInitialUpload) {
            useDataManagementStore.getState().nextInitialUploadStep();
        }

        return {
            data: data,
        };
    };

    private filterAlreadyExistingContact = async (data: string[][], cases: Map<string, CaseSchema>) => {
        const contactImports: {
            [id: string]: { imported: ContactImport; persisted: ContactSchema | null; import: boolean };
        } = {};
        for (const index in data) {
            const row = data[index];
            const case1 = cases.get(row[0]);
            const case2 = cases.get(row[1]);

            if (!case1 || !case2) {
                continue;
            }

            const existingContact = await db.contacts
                .where("[case_id_1+case_id_2+type+context]")
                .equals([case1.id, case2.id, row[2], row[3]])
                .first();

            if (existingContact) {
                continue;
            }

            contactImports[index] = {
                imported: {
                    contact_id: index,
                    case_id_1: case1.case_id,
                    case_id_2: case2.case_id,
                    type: row[2],
                    context: row[3],
                } satisfies ContactImport,
                persisted: null,
                import: true,
            };
        }
        if (Object.keys(contactImports).length === 0) {
            toast({
                title: "Die ausgewählte Datei enthält keine neuen Kontaktabgaben.",
                duration: 5000,
                variant: "default",
            });
        }
        return contactImports;
    };
}
