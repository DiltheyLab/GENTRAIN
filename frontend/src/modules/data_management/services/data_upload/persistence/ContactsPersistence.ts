import { db } from "@/modules/core/infrastructure/database";
import { CaseSchema } from "@/modules/core/models/cases";
import { ContactSchema, contactRules } from "@/modules/core/models/contacts";
import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";

export class ContactsPersistence extends PersistenceStrategy {
    protected persist = async (data: string[][]) => {
        const bulkData = [] as ContactSchema[];
        // create Set of caseIds to fetch them from the database
        const caseIds = new Set<string>();
        for (const row of data) {
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

        for (let i = 1; i < data.length; i++) {
            const row = data[i];

            const case1 = casesMap.get(row[0]);
            const case2 = casesMap.get(row[1]);

            if (!case1 || !case2) {
                return;
            }

            // Validate the data and throw an error if it is invalid
            const dto = contactRules.parse({
                case_id_1: case1.id,
                case_id_2: case2.id,
                type: row[2],
                context: row[3],
            }) as ContactSchema;
            bulkData.push(dto);
        }
        // Bulk add the data to the database
        await db.contacts.bulkAdd(bulkData);
    };
}
