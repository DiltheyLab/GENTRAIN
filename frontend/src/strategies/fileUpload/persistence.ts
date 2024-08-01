import { caseRules, CaseSchema } from "@/database/cases";
import { contactRules, ContactSchema } from "@/database/contacts";
import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";
import { getFlexibleCategoryNames, persistGroupsForCategories } from "@/services/categories";
import { parseGermanDateFormat } from "@/services/dates";
import { useAppStore } from "@/stores/app";
import { getOrPersistOutbreak } from "@/services/outbreaks";
import { getAndPersistVariantsForSample, getAndPersistVariantsForSamplesSynchronously } from "@/services/samples";
import { recalculateDistances } from "@/services/distanceMatrices";
import { useSampleUploadStore } from "@/stores/upload";

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
        await db.transaction("rw", [db.cases, db.categories, db.groups, db.outbreaks], async () => {
            // retrieve flexible category names from header row
            const flexibleCategoryNames = getFlexibleCategoryNames(caseData);
            caseData = caseData.slice(1, caseData.length);
            for (const row of caseData) {
                // persist case from csv columns
                const outbreakId = await getOrPersistOutbreak(row[6]);
                const data = {
                    case_id: row[0],
                    fasta_id: row[1] !== "" ? row[1] : null,
                    pathogen_id: pathogen.id,
                    outbreak_id: outbreakId ?? null,
                    group_ids: await persistGroupsForCategories(flexibleCategoryNames, row),
                    registered_at: parseGermanDateFormat(row[2]),
                } as CaseSchema;

                // Validate the data and throw an error if it is invalid
                const dto = caseRules.parse(data) as CaseSchema;
                db.cases.add(dto);
            }
        });
    },
    sampleStrategy: async (sampleData: { fastaId: string; sequence: string }[]) => {
        const activePathogen = useAppStore.getState().activePathogen;
        useSampleUploadStore.getState().setIsUploading(true);
        const variantRequestPromises: Promise<void>[] = [];
        for (const sample of sampleData) {
            // skip sample if it was excluded from uploads
            if (!Object.keys(useSampleUploadStore.getState().uploads).includes(sample.fastaId)) {
                continue;
            }
            // found case (only import if case exists)
            const sampleCase = await db.cases.where({ fasta_id: sample.fastaId }).first();
            // we currently only add samples if a case for the fasta id exists already
            // otherwise we would maximize the necessary amount of variant calculations
            if (sampleCase) {
                variantRequestPromises.push(getAndPersistVariantsForSample(sample));
            }
        }

        await getAndPersistVariantsForSamplesSynchronously(variantRequestPromises);
        // recalculate all sample distances to enable assembling a fresh distance matrix
        if (activePathogen) {
            await recalculateDistances(activePathogen.id);
        }
    },
    contactsStrategy: async (contactData: string[][]) => {
        const bulkData = [] as ContactSchema[];

        // create Set of caseIds to fetch them from the database
        const caseIds = new Set<string>();
        for (const row of contactData) {
            caseIds.add(row[0]);
            caseIds.add(row[1]);
        }

        const cases = await db.cases.where("case_id").anyOf(Array.from(caseIds)).toArray();

        // create lookup table to improve performance
        // fetching single cases in a loop is very unefficent with indexedDB
        const casesMap = new Map<string, CaseSchema>();
        for (const caseData of cases) {
            casesMap.set(caseData.case_id, caseData);
        }

        for (let i = 1; i < contactData.length; i++) {
            const row = contactData[i];

            const case1 = casesMap.get(row[0]); //use lookup table instead of single db operation
            const case2 = casesMap.get(row[1]);

            if (!case1 || !case2) {
                return;
            }

            const data = {
                case_id_1: case1.id,
                case_id_2: case2.id,
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
