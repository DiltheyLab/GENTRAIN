import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/infrastructure/database";
import { getAllCasesForPathogenWithRelationships, CaseSchema } from "@/modules/core/models/cases";
import { ValidationStrategy } from "./ValidationStrategy";

const CONTACT_COLUMN_NAMES = ["Fall ID 1", "Fall ID 2", "Typ", "Kontext"];

export class ContactsValidation extends ValidationStrategy {
    protected validate = async (data: string[][]) => {
        const activePathogen = this.coreState.activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        const allCases = await getAllCasesForPathogenWithRelationships(activePathogen.id);
        const header = data[0];
        const existingContacts = [] as string[];
        const missingCasesInDB = [] as string[];

        //check if header is exactly the same as columnNameRequirements
        if (!this.isHeaderValid(header, CONTACT_COLUMN_NAMES)) {
            throw new GentrainException("InvalidHeaderError");
        }

        for (let i = 1; i < data.length; i++) {
            const row = data[i];

            //check if case_id_1 and case_id_2 are not empty
            this.checkIfEmpty(row[0], "EmptyCaseId1");
            this.checkIfEmpty(row[1], "EmptyCaseId2");

            //check if case_id_1 and case_id_2 are in the system
            const missingCaseInColumnCaseId1 = this.findMissingCasesInDB(row[0], allCases);
            missingCaseInColumnCaseId1 && missingCasesInDB.push(missingCaseInColumnCaseId1);
            const missingCaseInColumnCaseId2 = this.findMissingCasesInDB(row[1], allCases);
            missingCaseInColumnCaseId2 && missingCasesInDB.push(missingCaseInColumnCaseId2);

            // check if contact already exists in the database
            const existingContact = await this.findExistingContactInDB(row, allCases);
            // safe the index of the row with the existing contact
            existingContact && existingContacts.push((i + 1).toString());
        }

        if (missingCasesInDB.length > 0) {
            throw new GentrainException("CaseDoesNotExist", this.removeDuplicates(missingCasesInDB));
        }
        if (existingContacts.length > 0) {
            throw new GentrainException("ContactAlreadyExist", existingContacts);
        }

        return {
            data: data,
        };
    };

    private findMissingCasesInDB = (caseId: string, cases: CaseSchema[]) => {
        if (!cases.some((c) => c["case_id"] === caseId)) {
            return caseId;
        }
    };
    private findExistingContactInDB = async (row: string[], cases: CaseSchema[]) => {
        const caseId1 = cases.find((c) => c["case_id"] === row[0])?.id;
        const caseId2 = cases.find((c) => c["case_id"] === row[1])?.id;

        if (!caseId1 || !caseId2) {
            return;
        }

        const existingContact = await db.contacts
            .where("[case_id_1+case_id_2+type+context]")
            .equals([caseId1, caseId2, row[2], row[3]])
            .first();
        return existingContact;
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
