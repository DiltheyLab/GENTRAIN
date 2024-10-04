import { toast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/infrastructure/database";
import { CaseSchema, caseRules } from "@/modules/core/models/cases";
import { persistGroupsForCategories } from "@/modules/core/models/groups";
import { getOrPersistOutbreak } from "@/modules/core/models/outbreaks";
import { PersistenceStrategy } from "@/modules/data_management/services/data_upload/persistence/PersistenceStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export class CasesPersistence extends PersistenceStrategy {
    protected persist = async () => {
        const pathogen = this.coreState.activePathogen;
        if (!pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        const caseUploads = useDataManagementStore.getState().caseUploads;

        // run db operations in transaction to rollback in error cases
        await db.transaction("rw", [db.cases, db.categories, db.groups, db.outbreaks], async () => {
            for (const caseId of Object.keys(caseUploads)) {
                const currentCase = caseUploads[caseId];
                if (!currentCase.upload) {
                    continue;
                }
                // persist case from csv columns
                const outbreakId = await getOrPersistOutbreak(currentCase.outbreak, pathogen.id);
                const data = {
                    case_id: caseId,
                    fasta_id: currentCase.fasta_id !== "" ? currentCase.fasta_id : null,
                    pathogen_id: pathogen.id,
                    outbreak_id: outbreakId ?? null,
                    group_ids: await persistGroupsForCategories(currentCase, pathogen.id),
                    registered_at: currentCase.registered_at,
                } as CaseSchema;

                // Validate the data and throw an error if it is invalid
                const dto = caseRules.parse(data) as CaseSchema;
                db.cases.add(dto);
            }
        });
        useDataManagementStore.getState().setCaseSelectionActive(false);
        useDataManagementStore.getState().clearCaseUploads();

        toast({
            title: "Datei wurde erfolgreich hochgeladen",
            duration: 5000,
            variant: "success",
        });
    };

    protected update = async () => {
        const pathogen = this.coreState.activePathogen;
        if (!pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        const existingCases = useDataManagementStore.getState().existingCases;
        // run db operations in transaction to rollback in error cases
        await db.transaction("rw", [db.cases, db.categories, db.groups, db.outbreaks], async () => {
            for (const caseId of Object.keys(existingCases)) {
                const currentCase = existingCases[caseId].caseUpload;
                if (!currentCase.upload) {
                    continue;
                }
                const outbreakId = await getOrPersistOutbreak(currentCase.outbreak, pathogen.id);
                // Validate the data and throw an error if it is invalid
                const existingCase = await db.cases.where({ case_id: caseId }).first();
                if (!existingCase) {
                    return;
                }
                db.cases.update(existingCase, {
                    case_id: caseId,
                    fasta_id: currentCase.fasta_id !== "" ? currentCase.fasta_id : null,
                    pathogen_id: pathogen.id,
                    outbreak_id: outbreakId ?? null,
                    group_ids: await persistGroupsForCategories(currentCase, pathogen.id),
                    registered_at: currentCase.registered_at,
                });
            }
        });
        useDataManagementStore.getState().clearExistingCases();
    };
}
