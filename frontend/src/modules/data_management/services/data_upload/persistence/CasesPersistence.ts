import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { getFlexibleCategoryNames } from "@/modules/core/helpers/categories";
import { parseGermanDateFormat } from "@/modules/core/helpers/dates";
import { db } from "@/modules/core/infrastructure/database";
import { CaseSchema, caseRules } from "@/modules/core/models/cases";
import { persistGroupsForCategories } from "@/modules/core/models/groups";
import { getOrPersistOutbreak } from "@/modules/core/models/outbreaks";
import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";

export class CasesPersistence extends PersistenceStrategy {
    protected persist = async (data: Array<Array<string>>) => {
        const pathogen = this.coreState.activePathogen;
        if (!pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        // run db operations in transaction to rollback in error cases
        await db.transaction("rw", [db.cases, db.categories, db.groups, db.outbreaks], async () => {
            // retrieve flexible category names from header row
            const flexibleCategoryNames = getFlexibleCategoryNames(data);
            data = data.slice(1, data.length);
            for (const row of data) {
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
    };
}
