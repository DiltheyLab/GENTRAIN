const caseColumnNames = ["Case Id", "Sequence Id", "Date", "Name", "First Name", "Birth Date", "Outbreak", "Location"];
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
        const header = contactData[0];

        //check if header is exactly the same as columnNameRequirements
        if (!isHeaderValid(header, contactColumnNames)) {
            throw new Error("InvalidHeaderError");
        }
        //gibt es zu jeder case_id_1 auch eine case_id_2 und umgekehrt
        //und sind diese auch schon im system?
    },
};
