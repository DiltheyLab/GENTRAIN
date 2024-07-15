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
        // run db operations in transaction to roll back in error cases
        await db.transaction("rw", db.cases, db.categories, db.groups, async () => {
            let existingCases = [];
            // retrieve flexible category names from header row
            const flexibleCategoryNames = getFlexibleCategoryNames(data);
            data = data.slice(1, data.length);
            for (const cell of data) {
                const caseCount = await db.cases.where({ case_id: cell[0] }).count();
                // throw exception if the case already exists
                if (caseCount > 0) {
                    existingCases.push(cell[0]);
                } else {
                    db.cases.add({
                        case_id: cell[0],
                        sample_id: cell[1],
                        date: cell[2],
                        pathogen_id: pathogen.id,
                        groups: await persistGroupsForCategories(flexibleCategoryNames, cell),
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
