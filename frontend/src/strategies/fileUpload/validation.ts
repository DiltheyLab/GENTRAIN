import { mockCases } from "@/data/mockCases";

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

export const validationStrategies = {
    casesStrategy: (caseData: string[][]) => {
        const header = caseData[0];
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!isCasesHeaderValid(header, caseColumnNames)) {
            throw new Error("InvalidHeaderError");
        }
    },
    contactsStrategy: (contactData: string[][]) => {
        //const allCases = useLiveQuery(() => db.cases.toArray());
        const allCases = mockCases;
        const header = contactData[0];

        //check if header is exactly the same as columnNameRequirements
        if (!isHeaderValid(header, contactColumnNames)) {
            throw new Error("InvalidHeaderError");
        }

        for (let i = 1; i < contactData.length; i++) {
            const row = contactData[i];
            //check if case_id_1 and case_id_2 are not empty
            if (row[0] === "") {
                throw new Error("EmptyCaseId1");
            } else if (row[1] === "") {
                throw new Error("EmptyCaseId2");
            }
            //check if case_id_1 and case_id_2 are in the system
            const caseId1IsInAllCases = allCases.some((c) => c["case_id"] === row[0]);
            const caseId2IsInAllCases = allCases.some((c) => c.case_id === row[1]);
            if (!caseId1IsInAllCases || !caseId2IsInAllCases) {
                throw new Error("CaseIdNotInSystem");
            }
        }
    },
};
