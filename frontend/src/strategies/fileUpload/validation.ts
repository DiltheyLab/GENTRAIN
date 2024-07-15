import { mockCases } from "@/data/mockCases";

const contactColumnNames = ["case_id_1", "case_id_2", "type", "context"];

const isHeaderValid = (header: string[], contactColumnNames: string[]) => {
    return (
        header.length === contactColumnNames.length &&
        header.every((value, index) => value === contactColumnNames[index])
    );
};

export const validationStrategies = {
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
    strategy2: (data: any) => {},
};
