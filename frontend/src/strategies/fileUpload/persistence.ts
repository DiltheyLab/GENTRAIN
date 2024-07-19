import { caseRules, CaseSchema } from "@/database/cases";
import { contactRules, ContactSchema } from "@/database/contacts";
import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";
import { getFlexibleCategoryNames, persistGroupsForCategories } from "@/services/categories";
import { parseGermanDateFormat } from "@/services/dates";
import { useAppStore } from "@/stores/app";
import { getOrPersistOutbreak } from "@/services/outbreaks";
import { getVariantsForSequence } from "@/services/samples";
import { persistSampleDistances } from "@/services/distanceMatrices";

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
        await db.transaction("rw", db.cases, db.categories, db.groups, db.outbreaks, async () => {
            // retrieve flexible category names from header row
            const flexibleCategoryNames = getFlexibleCategoryNames(caseData);
            caseData = caseData.slice(1, caseData.length);
            for (const row of caseData) {
                // persist case from csv columns
                const data = {
                    case_id: row[0],
                    sample_id: row[1] !== "" ? row[1] : null,
                    pathogen_id: pathogen.id,
                    outbreak_id: await getOrPersistOutbreak(row[6]),
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
            // we currently only add samples if a case for the fasta id exists already
            // otherwise we would maximize the necessary amount of variant calculations
            if (sampleCase) {
                const variantsResult = await getVariantsForSequence(sample.sequence);
                await db.samples.add({
                    fasta_id: sample.fastaId,
                    lineage: variantsResult.lineage,
                    n_count: variantsResult.n_count,
                    sequence_length: sample.sequence.length,
                    variants: variantsResult.variants,
                });
            }
        }
        const activePathogen = useAppStore.getState().activePathogen;
        if (activePathogen) {
            persistSampleDistances(activePathogen.id);
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
