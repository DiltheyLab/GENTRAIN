import { mockCases } from "@/data/mockCases";
import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";

const caseColumnNames = ["Case Id", "Sequence Id", "Date", "Name", "First Name", "Birth Date", "Outbreak"];
const contactColumnNames = ["case_id_1", "case_id_2", "type", "context"];

const isHeaderValid = (header: string[], columnNames: string[]) => {
    return header.length === columnNames.length && header.every((value, index) => value === columnNames[index]);
};

const isCasesHeaderValid = (header: string[], columnNames: string[]) => {
    // exclude additional category columns from header validation
    const requiredHeaderColumnNames = header.slice(0, caseColumnNames.length);
    return (
        requiredHeaderColumnNames.length === columnNames.length &&
        requiredHeaderColumnNames.every((value, index) => value === columnNames[index])
    );
};

const checkIfEmpty = (value: string, error: string) => {
    if (!value) {
        throw new GentrainException(error);
    }
};

const findMissingCases = (caseId: string, cases: any[]) => {
    const missingCases: string[] = [];
    if (!cases.some((c) => c["case_id"] === caseId)) {
        missingCases.push(caseId);
    }
    return missingCases;
};

const findExistingContactInDB = async (row: string[], rowIndex: number) => {
    const existingContact = await db.contacts
        .where({ case_id_1: row[0], case_id_2: row[1], type: row[2], context: row[3] })
        .first();
    console.log(existingContact);
    console.log(rowIndex);
    console.log(row);
    return existingContact;
};

export const validationStrategies = {
    casesStrategy: (caseData: string[][]) => {
        const header = caseData[0];
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!isCasesHeaderValid(header, caseColumnNames)) {
            throw new GentrainException("InvalidHeaderError");
        }
    },
    contactsStrategy: (contactData: string[][]) => {
        //const allCases = useLiveQuery(() => db.cases.toArray());
        const allCases = mockCases;
        const header = contactData[0];

        //check if header is exactly the same as columnNameRequirements
        if (!isHeaderValid(header, contactColumnNames)) {
            throw new GentrainException("InvalidHeaderError");
        }

        for (let i = 1; i < contactData.length; i++) {
            const row = contactData[i];

            //check if case_id_1 and case_id_2 are not empty
            checkIfEmpty(row[0], "EmptyCaseId1");
            checkIfEmpty(row[1], "EmptyCaseId2");

            //check if case_id_1 and case_id_2 are in the system
            const missingCasesInColumnCaseId1 = findMissingCases(row[0], allCases);
            const missingCasesInColumnCaseId2 = findMissingCases(row[1], allCases);
            const totalMissingCases = [...missingCasesInColumnCaseId1, ...missingCasesInColumnCaseId2];

            if (totalMissingCases.length > 0) {
                throw new GentrainException("CaseDoesNotExist", totalMissingCases);
            }

            //check if contact is already in the system
            const existingContact = findExistingContactInDB(row, i);
            if (existingContact) {
                throw new GentrainException("ContactAlreadyExist", existingContact);
            }
        }
    },
};
