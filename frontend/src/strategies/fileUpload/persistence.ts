import { caseRules, CaseSchema } from "@/database/cases";
import { contactRules, ContactSchema } from "@/database/contacts";
import { db } from "@/database/db";
import { GentrainException } from "@/exceptions/GentrainException";
import { getFlexibleCategoryNames, persistGroupsForCategories } from "@/services/categories";
import { parseGermanDateFormat } from "@/services/dates";
import { useAppStore } from "@/stores/app";
import { getOrPersistOutbreak } from "@/services/outbreaks";
import { useSampleUploadStore } from "@/stores/upload";
import { getPathogenTypeForActivePathogen } from "@/database/pathogen_types";
import { PathogenStrategyManager } from "../PathogenStrategyManager";

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
                const outbreakId = await getOrPersistOutbreak(row[6], pathogen.id);
                const data = {
                    case_id: row[0],
                    fasta_id: row[1] !== "" ? row[1] : null,
                    pathogen_id: pathogen.id,
                    outbreak_id: outbreakId ?? null,
                    group_ids: await persistGroupsForCategories(flexibleCategoryNames, row, pathogen.id),
                    registered_at: parseGermanDateFormat(row[2]),
                } as CaseSchema;

                // Validate the data and throw an error if it is invalid
                const dto = caseRules.parse(data) as CaseSchema;
                db.cases.add(dto);
            }
        });
    },
    sampleStrategy: async (sampleData: { fastaId: string; sequence: string }[]) => {
        const activePathogenType = await getPathogenTypeForActivePathogen();
        if (!activePathogenType) {
            return;
        }
        const activePathogenTypeName = activePathogenType.name.toString();
        useSampleUploadStore.getState().setIsUploading(true);

        // analyse sample depending on pathogen type to receive variants for distance calculations
        const sampleAnalysisStrategy = PathogenStrategyManager.getSampleAnalysisStrategy(activePathogenTypeName);
        sampleAnalysisStrategy.setSampleData(sampleData);
        await sampleAnalysisStrategy.execute();

        // recalculate all sample distances to enable assembling a fresh distance matrix
        const distanceCalculationStrategy =
            PathogenStrategyManager.getDistanceCalculationStrategy(activePathogenTypeName);
        await distanceCalculationStrategy.execute();
        useSampleUploadStore.getState().setIsUploading(false);
    },
    contactsStrategy: async (contactData: string[][]) => {
        const bulkData = [] as ContactSchema[];

        for (let i = 1; i < contactData.length; i++) {
            const row = contactData[i];

            const case1 = await db.cases.where({ case_id: row[0] }).first();
            const case2 = await db.cases.where({ case_id: row[1] }).first();

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
