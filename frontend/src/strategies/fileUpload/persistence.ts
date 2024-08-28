import { db } from "@/modules/core/infrastructure/database";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { parseGermanDateFormat } from "@/modules/core/helpers/dates";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { PathogenStrategyManager } from "../PathogenStrategyManager";
import { getFlexibleCategoryNames } from "@/modules/core/helpers/categories";
import { CaseSchema, caseRules } from "@/modules/core/models/cases";
import { ContactSchema, contactRules } from "@/modules/core/models/contacts";
import { persistGroupsForCategories } from "@/modules/core/models/groups";
import { getOrPersistOutbreak } from "@/modules/core/models/outbreaks";
import { getPathogenTypeForActivePathogen } from "@/modules/core/models/pathogen_types";
import { useCoreStore } from "@/modules/core/stores/core";

/**
 * Object containing persistence strategies for uploads of type cases, samples and contacts.
 */
export const persistenceStrategies = {
    casesStrategy: async (caseData: Array<Array<string>>) => {
        const pathogen = useCoreStore.getState().activePathogen;
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
                const outbreakId = await getOrPersistOutbreak(row[3], pathogen.id);
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
        useDataManagementStore.getState().setIsUploading(true);

        // analyse sample depending on pathogen type to receive variants for distance calculations
        const sampleAnalysisStrategy = PathogenStrategyManager.getSampleAnalysisStrategy(activePathogenTypeName);
        sampleAnalysisStrategy.setSampleData(sampleData);
        await sampleAnalysisStrategy.execute();

        // recalculate all sample distances to enable assembling a fresh distance matrix
        const distanceCalculationStrategy =
            PathogenStrategyManager.getDistanceCalculationStrategy(activePathogenTypeName);
        await distanceCalculationStrategy.execute();
        useDataManagementStore.getState().setIsUploading(false);
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

            const case1 = casesMap.get(row[0]);
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
