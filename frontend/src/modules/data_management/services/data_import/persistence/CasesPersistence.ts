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
import {ContactsPersistence} from "@/modules/data_management/services/data_import/persistence/ContactsPersistence";

export class CasesPersistence extends PersistenceStrategy {
    protected persist = async () => {
        const pathogen = useCoreStore.getState().activePathogen;
        if (!pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        const caseImports = useDataManagementStore.getState().caseImports;

        // run db operations in transaction to rollback in error cases
        await db.transaction("rw", [db.cases, db.categories, db.groups, db.outbreaks, db.contacts], async () => {
            const collectedInfectedByContacts: { case_id_1: string, case_id_2: string }[] = [];
            const caseIdMap = new Map<string, number>();
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
                    caseIdMap.set(caseId, persistedCase.id);
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
                    caseIdMap.set(caseId, id);
                }
                if (importedCase.infected_by) {
                    collectedInfectedByContacts.push({
                        case_id_1: caseId,
                        case_id_2: importedCase.infected_by,
                    })
                }
            }
            ContactsPersistence.createInfectedByContactsFromCasesImport(caseIdMap, collectedInfectedByContacts);
            await ContactsPersistence.createSameAddressContactsForActivePathogen(pathogen.id);
            await ContactsPersistence.createSameLastnameContactsForActivePathogen(pathogen.id);
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
