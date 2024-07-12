import { db } from "@/database/db";

export const persistenceStrategies = {
    casesStrategy: (data: Array<Array<string>>) => {
        console.log(data);
        data.forEach((row) => {
            db.cases.add({
                case_id: row[0],
                sample_id: row[1],
                date: row[2],
                pathogen_id: 1,
                groups: [],
                updated_at: new Date().toISOString(),
            });
        });
    },
    contactsStrategy: (data: any) => {},
};
