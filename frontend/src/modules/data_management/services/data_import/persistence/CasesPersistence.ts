import {toast} from "@/modules/core/components/ui/UseToast";
import {GentrainException} from "@/modules/core/exceptions/GentrainException";
import {db} from "@/modules/core/services/database/DatabaseManager";
import {CaseSchema, caseRules} from "@/modules/core/models/cases";
import {persistGroupsForCategories} from "@/modules/core/models/groups";
import {getOrPersistOutbreak} from "@/modules/core/models/outbreaks";
import {useCoreStore} from "@/modules/core/stores/core";
import {useDataManagementStore} from "@/modules/data_management/stores/dataManagement";
import {PersistenceStrategy} from "./PersistenceStrategy";
import {setInitializedAtForPathogenType} from "@/modules/core/models/pathogen_types";
import {ContactImport} from "@/core/models/contacts.ts";

export class CasesPersistence extends PersistenceStrategy {
    protected persist = async () => {
        const pathogen = useCoreStore.getState().activePathogen;
        if (!pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        const caseImports = useDataManagementStore.getState().caseImports;

        // run db operations in transaction to rollback in error cases
        await db.transaction("rw", [db.cases, db.categories, db.groups, db.outbreaks, db.contacts], async () => {
            const collectedContacts: ContactImport[] = [];
            const caseIdsMap = new Map<string, number>();

            for (const caseId of Object.keys(caseImports)) {
                if (!caseImports[caseId].import) {
                    continue;
                }
                const importedCase = caseImports[caseId].imported;
                const persistedCase = caseImports[caseId].persisted;
                if (persistedCase) {
                    const dto = caseRules.parse({
                        case_id: caseId,
                        fasta_id: importedCase.fasta_id !== "" ? importedCase.fasta_id : null,
                        pathogen_id: pathogen.id,
                        outbreak_id: importedCase.outbreak
                            ? await getOrPersistOutbreak(importedCase.outbreak, pathogen.id)
                            : null,
                        group_ids: await persistGroupsForCategories(importedCase, pathogen.id),
                        registered_at: importedCase.registered_at,
                        street: importedCase.street,
                        zip_code: importedCase.zip_code,
                        city: importedCase.city,
                        first_name: importedCase.first_name,
                        last_name: importedCase.last_name,
                    } as CaseSchema);
                    db.cases.update(persistedCase, dto);
                } else {
                    const dto = caseRules.parse({
                        case_id: caseId,
                        fasta_id: importedCase.fasta_id !== "" ? importedCase.fasta_id : null,
                        pathogen_id: pathogen.id,
                        outbreak_id: importedCase.outbreak
                            ? await getOrPersistOutbreak(importedCase.outbreak, pathogen.id)
                            : null,
                        group_ids: await persistGroupsForCategories(importedCase, pathogen.id),
                        registered_at: importedCase.registered_at,
                        street: importedCase.street,
                        zip_code: importedCase.zip_code,
                        city: importedCase.city,
                        first_name: importedCase.first_name,
                        last_name: importedCase.last_name,
                    } as CaseSchema);
                    const id = await db.cases.add(dto);
                    caseIdsMap.set(caseId, id)
                }
                if (importedCase.infected_by) {
                    collectedContacts.push({
                        case_id_1: caseId,
                        case_id_2: importedCase.infected_by,
                        type: "Angesteckt bei",
                        context: ""
                    })
                }
            }
            const contacts = collectedContacts.filter(
                (contact) => caseIdsMap.get(contact.case_id_1) && caseIdsMap.get(contact.case_id_2)
            ).map((contact) => {
                return {
                    case_id_1: caseIdsMap.get(contact.case_id_1)!,
                    case_id_2: caseIdsMap.get(contact.case_id_2)!,
                    type: contact.type,
                    context: ""
                }
            });

            db.contacts.bulkAdd(contacts)
        });

        useDataManagementStore.getState().setCaseSelectionActive(false);
        useDataManagementStore.getState().clearCaseImports();
        const activePathogen = useCoreStore.getState().activePathogen;
        if (activePathogen) {
            setInitializedAtForPathogenType(activePathogen.pathogen_type_id);
        }

        toast({
            title: "Datei wurde erfolgreich hochgeladen",
            duration: 5000,
            variant: "success",
        });
    };
}
