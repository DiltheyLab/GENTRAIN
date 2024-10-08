import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/infrastructure/database";
import { CaseSchema } from "@/modules/core/models/cases";
import { ValidationStrategy } from "./ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ContactImport } from "@/modules/core/models/contacts";

const CONTACT_COLUMN_NAMES = ["Fall ID 1", "Fall ID 2", "Typ", "Kontext"];

export class ContactsValidation extends ValidationStrategy {
    protected validate = async (data: string[][]) => {
        const activePathogen = this.coreState.activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        const header = data[0];
        data = data.slice(1, data.length);
        const missingCasesInDB = [] as string[];

        //check if header is exactly the same as columnNameRequirements
        if (!this.isHeaderValid(header, CONTACT_COLUMN_NAMES)) {
            throw new GentrainException("InvalidHeaderError");
        }

        const cases = await db.cases.where({ pathogen_id: activePathogen.id }).toArray();
        const caseMap = new Map<string, CaseSchema>();
        for (const caseData of cases) {
            caseMap.set(caseData.case_id, caseData);
        }

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            //check if case_id_1 and case_id_2 are not empty
            this.checkIfEmpty(row[0], "EmptyCaseId1");
            this.checkIfEmpty(row[1], "EmptyCaseId2");

            //check if case_id_1 and case_id_2 are in the system
            const missingCaseInColumnCaseId1 = this.findMissingCasesInDB(row[0], cases);
            missingCaseInColumnCaseId1 && missingCasesInDB.push(missingCaseInColumnCaseId1);
            const missingCaseInColumnCaseId2 = this.findMissingCasesInDB(row[1], cases);
            missingCaseInColumnCaseId2 && missingCasesInDB.push(missingCaseInColumnCaseId2);
        }

        if (missingCasesInDB.length > 0) {
            throw new GentrainException("CaseDoesNotExist", this.removeDuplicates(missingCasesInDB));
        }

        const contactUploads = await this.filterAlreadyExistingContact(data, caseMap);
        useDataManagementStore.getState().changeContactUploads(contactUploads);
        this.dataManagementState.setContactSelectionActive(true);

        return {
            data: data,
        };
    };

    private findMissingCasesInDB = (caseId: string, cases: CaseSchema[]) => {
        if (!cases.some((c) => c["case_id"] === caseId)) {
            return caseId;
        }
    };

    private filterAlreadyExistingContact = async (data: string[][], cases: Map<string, CaseSchema>) => {
        const contactUploads: { [contactId: string]: ContactImport } = {};
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

            contactUploads[index] = {
                contact_id: index,
                case_id_1: case1.case_id,
                case_id_2: case2.case_id,
                type: row[2],
                context: row[3],
                upload: true,
            } satisfies ContactImport;
        }
        return contactUploads;
    };

    private removeDuplicates = (array: string[]) => {
        return [...new Set(array)];
    };

    private checkIfEmpty = (value: string, error: string) => {
        if (!value) {
            throw new GentrainException(error);
        }
    };
}
