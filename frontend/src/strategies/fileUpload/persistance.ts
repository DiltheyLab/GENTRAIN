import { ContactSchema } from "@/database/contacts";
import { db } from "@/database/db";
import { z } from "zod";

export const persistenceStrategies = {
    contactsStrategy: async (contactData: string[][]) => {
        const bulkData = [] as ContactSchema[];
        const contactSchema = z.object({
            case_id_1: z.string().min(1),
            case_id_2: z.string().min(1),
            type: z.string(),
            context: z.string(),
            updated_at: z.string(),
        });
        for (let i = 1; i < contactData.length; i++) {
            const row = contactData[i];

            const dto = {
                case_id_1: row[0],
                case_id_2: row[1],
                type: row[2],
                context: row[3],
                updated_at: new Date().toString(),
            } as ContactSchema;

            // Validate the data and throw an error if it is invalid
            contactSchema.parse(dto);
            bulkData.push(dto);
        }
        // Bulk add the data to the database
        const key = await db.contacts.bulkAdd(bulkData);

        return true;
    },
    strategy2: (data: any) => {},
};
