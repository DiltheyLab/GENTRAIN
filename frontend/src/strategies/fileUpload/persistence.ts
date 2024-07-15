import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";
import { getFlexibleCategoryNames, persistGroupsForCategories } from "@/services/categories";
import { useAppStore } from "@/stores/app";

/**
 * Object containing persistence strategies for uploads of type cases, samples and contacts.
 */
export const persistenceStrategies = {
    casesStrategy: async (data: Array<Array<string>>) => {
        const pathogen = useAppStore.getState().activePathogen;
        if (!pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        // run db operations in transaction to rollback in error cases
        await db.transaction("rw", db.cases, db.categories, db.groups, async () => {
            let existingCases = [];
            // retrieve flexible category names from header row
            const flexibleCategoryNames = getFlexibleCategoryNames(data);
            data = data.slice(1, data.length);
            for (const row of data) {
                const caseCount = await db.cases.where({ case_id: row[0] }).count();
                if (caseCount > 0) {
                    // throw exception if the case already exists
                    existingCases.push(row[0]);
                } else {
                    // persist case from csv columns
                    db.cases.add({
                        case_id: row[0],
                        sample_id: row[1],
                        date: new Date(row[2]).toISOString(),
                        pathogen_id: pathogen.id,
                        groups: await persistGroupsForCategories(flexibleCategoryNames, row),
                        updated_at: new Date().toISOString(),
                    });
                }
            }
            if (existingCases.length > 0) {
                throw new GentrainException("CasesAlreadyExist", existingCases);
            }
        });
    },
    contactsStrategy: (data: any) => {
        return;
    },
};
