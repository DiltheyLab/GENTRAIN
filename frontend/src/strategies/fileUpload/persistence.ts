import { caseRules, CaseSchema } from "@/database/cases";
import { contactRules, ContactSchema } from "@/database/contacts";
import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";
import { getFlexibleCategoryNames, persistGroupsForCategories } from "@/services/categories";
import { parseGermanDateFormat } from "@/services/dates";
import { useAppStore } from "@/stores/app";

/**
 * Object containing persistence strategies for uploads of type cases, samples and contacts.
 */
export const persistenceStrategies = {
    casesStrategy: async (caseData: Array<Array<string>>) => {
        const pathogen = useAppStore.getState().activePathogen;
        if (!pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        // run db operations in transaction to rollback in error cases
        await db.transaction("rw", db.cases, db.categories, db.groups, async () => {
            // retrieve flexible category names from header row
            const flexibleCategoryNames = getFlexibleCategoryNames(caseData);
            caseData = caseData.slice(1, caseData.length);
            for (const row of caseData) {
                // persist case from csv columns
                const data = {
                    case_id: row[0],
                    sample_id: row[1] !== "" ? row[1] : null,
                    pathogen_id: pathogen.id,
                    groups: await persistGroupsForCategories(flexibleCategoryNames, row),
                    registered_at: parseGermanDateFormat(row[2]),
                } as CaseSchema;

                // Validate the data and throw an error if it is invalid
                const dto = caseRules.parse(data) as CaseSchema;
                db.cases.add(dto);
            }
        });
    },
    sampleStrategy: async (sampleData: { fastaId: string; sequence: string }[]) => {
        for (const sample of sampleData) {
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ sample_id: sample.fastaId }).first();
            await db.samples.add({
                fasta_id: sample.fastaId,
                sequence: sample.sequence,
                sampled_at: sampleCase ? sampleCase.registered_at : null,
            });

            // get fasta data
            // get variants
        }
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
            } as ContactSchema;

            // Validate the data and throw an error if it is invalid
            const dto = contactRules.parse(data) as ContactSchema;
            bulkData.push(dto);
        }
        // Bulk add the data to the database
        await db.contacts.bulkAdd(bulkData);
    },
};
