import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";
import { useAppStore } from "@/stores/app";

export const persistenceStrategies = {
    casesStrategy: async (data: Array<Array<string>>) => {
        const pathogen = useAppStore.getState().activePathogen;
        if (!pathogen) {
            throw new Error("InvalidPathogenSelection");
        }
        // run db operations in transaction to roll back in error cases
        await db.transaction("rw", db.cases, async () => {
            let existingCases = [];
            for (const row of data) {
                const caseCount = await db.cases.where({ case_id: row[0] }).count();
                // throw exception if the case already exists
                if (caseCount > 0) {
                    existingCases.push(row[0]);
                } else {
                    db.cases.add({
                        case_id: row[0],
                        sample_id: row[1],
                        date: row[2],
                        pathogen_id: pathogen.id,
                        groups: [],
                        updated_at: new Date().toISOString(),
                    });
                }
            }
            if (existingCases.length > 0) {
                throw new GentrainException("CasesAlreadyExist", existingCases);
            }
        });
        return true;
    },
    contactsStrategy: (data: any) => {
        return true;
    },
};
