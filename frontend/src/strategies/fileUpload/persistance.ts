import { contactRules, ContactSchema } from "@/database/contacts";
import { db } from "@/database/db";

export const persistenceStrategies = {
    contactsStrategy: async (contactData: string[][]) => {
        const bulkData = [] as ContactSchema[];

        for (let i = 1; i < contactData.length; i++) {
            const row = contactData[i];

            const data = {
                case_id_1: row[0],
                case_id_2: row[1],
                type: row[2],
                context: row[3],
                updated_at: new Date(),
            } as ContactSchema;

            // Validate the data and throw an error if it is invalid
            const dto = contactRules.parse(data) as ContactSchema;
            bulkData.push(dto);
        }
        // Bulk add the data to the database
        await db.contacts.bulkAdd(bulkData);
    },
    strategy2: (data: any) => {},
};
