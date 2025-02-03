import { toast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { CaseImport, CaseSchema, caseRules } from "@/modules/core/models/cases";
import { persistGroupsForCategories } from "@/modules/core/models/groups";
import { getOrPersistOutbreak } from "@/modules/core/models/outbreaks";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { PersistenceStrategy } from "./PersistenceStrategy";
import { setInitializedAtForPathogenType } from "@/modules/core/models/pathogen_types";
import { ContactsPersistence } from "@/modules/data_management/services/data_import/persistence/ContactsPersistence";
import { CaseImports } from "@/modules/data_management/types/import";

export class CasesPersistence extends PersistenceStrategy {
    protected persist = async () => {
        if (!this.pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        const caseImports = useDataManagementStore.getState().caseImports;
        this.createOrUpdateCases(caseImports);

        useDataManagementStore.getState().setCaseSelectionActive(false);
        useDataManagementStore.getState().clearCaseImports();
        setInitializedAtForPathogenType(this.pathogen.pathogen_type_id);

        toast({
            title: "Datei wurde erfolgreich hochgeladen",
            duration: 5000,
            variant: "success",
        });
    };

    private async createOrUpdateCases(caseImports: CaseImports) {
        await db.transaction("rw", [db.cases, db.categories, db.groups, db.outbreaks, db.contacts], async () => {
            const collectedInfectedByContacts: { case_id_1: string; case_id_2: string }[] = [];
            const caseIdMap = new Map<string, number>();
            for (const caseId of Object.keys(caseImports)) {
                if (!caseImports[caseId].import) {
                    continue;
                }
                const importedCase = caseImports[caseId].imported;
                const persistedCase = caseImports[caseId].persisted;
                const dto = await this.sanitizeAndGetCaseSchema(caseId, importedCase);
                const id = persistedCase ? await db.cases.update(persistedCase, dto) : await db.cases.add(dto);
                caseIdMap.set(caseId, id);

                // add infected by contact if one exists
                if (importedCase.infected_by) {
                    collectedInfectedByContacts.push({
                        case_id_1: caseId,
                        case_id_2: importedCase.infected_by,
                    });
                }
            }
            await ContactsPersistence.removeCaseBasedContactsForActivePathogen(caseIdMap, this.pathogen!.id);
            await this.createContacts(caseIdMap, collectedInfectedByContacts);
        });
    }

    private async sanitizeAndGetCaseSchema(caseId: string, importedCase: CaseImport) {
        return caseRules.parse({
            case_id: caseId,
            fasta_id: importedCase.fasta_id !== "" ? importedCase.fasta_id : null,
            pathogen_id: this.pathogen!.id,
            outbreak_id: importedCase.outbreak
                ? await getOrPersistOutbreak(importedCase.outbreak, this.pathogen!.id)
                : null,
            group_ids: await persistGroupsForCategories(importedCase, this.pathogen!.id),
            registered_at: importedCase.registered_at,
            street: importedCase.street,
            zip_code: importedCase.zip_code,
            city: importedCase.city,
            first_name: importedCase.first_name,
            last_name: importedCase.last_name,
        } as CaseSchema);
    }

    private async createContacts(
        caseIdMap: Map<string, number>,
        collectedInfectedByContacts: { case_id_1: string; case_id_2: string }[]
    ) {
        if (!this.pathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        await ContactsPersistence.createInfectedByContactsFromCasesImport(caseIdMap, collectedInfectedByContacts);
        await ContactsPersistence.createSameAddressAndLastnameContactsForActivePathogen(this.pathogen!.id);
        await ContactsPersistence.createSameAddressAndDifferentLastnameContactsForActivePathogen(this.pathogen!.id);
    }
}
