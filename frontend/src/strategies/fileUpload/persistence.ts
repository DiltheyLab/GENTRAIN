import { caseRules, CaseSchema } from "@/database/cases";
import { contactRules, ContactSchema } from "@/database/contacts";
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
                    const data = {
                        case_id: row[0],
                        sample_id: row[1] !== "" ? row[1] : null,
                        pathogen_id: pathogen.id,
                        groups: await persistGroupsForCategories(flexibleCategoryNames, row),
                        date: new Date(row[2]),
                        updated_at: new Date(),
                    } as CaseSchema;

                    // Validate the data and throw an error if it is invalid
                    const dto = caseRules.parse(data) as CaseSchema;
                    db.cases.add(dto);
                }
            }
            if (existingCases.length > 0) {
                throw new GentrainException("CasesAlreadyExist", existingCases);
            }
        });
    },
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
};
