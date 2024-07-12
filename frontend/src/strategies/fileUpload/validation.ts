const contactColumnNames = ["case_id_1", "case_id_2", "type", "context"];

const isHeaderValid = (header: string[], contactColumnNames: string[]) => {
    return (
        header.length === contactColumnNames.length &&
        header.every((value, index) => value === contactColumnNames[index])
    );
};

export const validationStrategies = {
    contactsStrategy: (contactData: string[][]) => {
        const header = contactData[0];
        console.log(header);

        //check if header is exactly the same as columnNameRequirements
        if (!isHeaderValid(header, contactColumnNames)) {
            throw new Error("InvalidHeaderError");
        }
        //gibt es zu jeder case_id_1 auch eine case_id_2 und umgekehrt
        //und sind diese auch schon im system?
    },
    strategy2: (data: any) => {},
};
