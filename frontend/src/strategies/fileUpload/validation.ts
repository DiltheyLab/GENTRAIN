import { CaseSchema, getAllCasesWithRelationships } from "@/database/cases";
import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";
import { useSampleUploadStore } from "@/stores/upload";

const caseColumnNames = ["Case Id", "Sequence Id", "Date", "Name", "First Name", "Birth Date", "Outbreak"];
const contactColumnNames = ["Case Id 1", "Case Id 2", "Type", "Context"];

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

const findMissingCasesInDB = (caseId: string, cases: CaseSchema[]) => {
    if (!cases.some((c) => c["case_id"] === caseId)) {
        return caseId;
    }
};

export const findExistingContactInDB = async (row: string[], cases: CaseSchema[]) => {
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

const removeDuplicates = (array: string[]) => {
    return [...new Set(array)];
};

const getAlreadyExistingCases = async (data: Array<Array<string>>) => {
    let existingCases = [];

    for (const row of data) {
        const caseCount = await db.cases.where({ case_id: row[0] }).count();
        if (caseCount > 0) {
            existingCases.push(row[0]);
        }
    }
    return existingCases;
};

export const validationStrategies = {
    casesStrategy: async (caseData: string[][]) => {
        const header = caseData[0];
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!isCasesHeaderValid(header, caseColumnNames)) {
            throw new GentrainException("InvalidHeaderError");
        }
        // receive ids of cases already persisted in the db to throw an error containing case ids
        const existingCases = await getAlreadyExistingCases(caseData.slice(1, caseData.length));
        if (existingCases.length > 0) {
            throw new GentrainException("CasesAlreadyExist", existingCases);
        }
        return {
            data: caseData,
            warnings: [],
        };
    },
    sampleStrategy: async (sampleData: { fastaId: string; sequence: string }[]) => {
        const samplesWithoutCase: string[] = [];

        for (const sample of sampleData) {
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ fasta_id: sample.fastaId }).first();
            const existingSample = await db.samples.where({ fasta_id: sample.fastaId }).first();
            if (!sampleCase || existingSample) {
                samplesWithoutCase.push(sample.fastaId);
            } else {
                useSampleUploadStore.getState().changeUpload(sample.fastaId, "pending");
            }
        }

        // get only sampleds which were not marked as a sample without a case
        sampleData = sampleData.filter(function (sample) {
            return !samplesWithoutCase.includes(sample.fastaId);
        });

        return {
            data: sampleData,
            warnings:
                samplesWithoutCase.length > 0
                    ? [
                          {
                              title: "Folgende Sequenzen existieren bereits oder konnten keinem existierenden Fall zugeordnet werden.",
                              description: samplesWithoutCase.join(", "),
                          },
                      ]
                    : [],
        };
    },
    contactsStrategy: async (contactData: string[][]) => {
        const allCases = await getAllCasesWithRelationships();
        const header = contactData[0];
        const existingContacts = [] as string[];
        const missingCasesInDB = [] as string[];

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
            const missingCaseInColumnCaseId1 = findMissingCasesInDB(row[0], allCases);
            missingCaseInColumnCaseId1 && missingCasesInDB.push(missingCaseInColumnCaseId1);
            const missingCaseInColumnCaseId2 = findMissingCasesInDB(row[1], allCases);
            missingCaseInColumnCaseId2 && missingCasesInDB.push(missingCaseInColumnCaseId2);

            // check if contact already exists in the database
            const existingContact = await findExistingContactInDB(row, allCases);
            // safe the index of the row with the existing contact
            existingContact && existingContacts.push((i + 1).toString());
        }

        if (missingCasesInDB.length > 0) {
            throw new GentrainException("CaseDoesNotExist", removeDuplicates(missingCasesInDB));
        }
        if (existingContacts.length > 0) {
            throw new GentrainException("ContactAlreadyExist", existingContacts);
        }

        return {
            data: contactData,
            warnings: [],
        };
    },
};
