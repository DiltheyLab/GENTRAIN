import { toast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { formatDate, parseGermanDateFormat } from "@/modules/core/helpers/dates";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { CaseImport, CaseWithRelationships, getWithRelations } from "@/modules/core/models/cases";
import { getOutbreaksForPathogenId, OutbreakSchema } from "@/modules/core/models/outbreaks";
import { ObjectRelationalMapper } from "@/modules/core/services/database/ObjectRelationalMapper";
import { useCoreStore } from "@/modules/core/stores/core";
import { ValidationStrategy } from "@/modules/data_management/services/data_import/validation/ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { CaseImports } from "@/modules/data_management/types/import";

export class CasesValidation extends ValidationStrategy {
    protected data: string[][] = [];
    protected header: string[] = [];
    protected outbreaks?: Map<any, OutbreakSchema>;
    protected cases?: Map<string, CaseWithRelationships>;
    protected columnNames = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];

    public collectData(data: string[][]) {
        this.header = data[0];
        // remove header from csv input
        this.data = data.slice(1, data.length);
    }

    protected async validate() {
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!this.isCasesHeaderValid()) {
            throw new GentrainException("InvalidHeaderError");
        }
        // receive ids of cases already persisted in the db to throw an error containing case ids
        const caseImports = await this.collectCaseImports();
        useDataManagementStore.getState().setCaseSelectionActive(true);
        useDataManagementStore.getState().setCaseImports(caseImports);

        if (Object.keys(caseImports).length === 0) {
            toast({
                title: "Die ausgewählte Datei enthält keine neuen Fälle.",
                duration: 5000,
                variant: "default",
            });
        } else {
            if (useDataManagementStore.getState().showImportAssistent) {
                useDataManagementStore.getState().nextImportAssistentStep();
            }
        }

        return {
            data: this.data,
        };
    }

    private isCasesHeaderValid() {
        // validate if 3 flexible columns were included and execute parent header validation
        return this.header.length <= this.columnNames.length + 3 && this.isHeaderValid();
    }

    private async collectCaseImports() {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            return {};
        }

        const caseIds = this.data.map((row) => row[0]);
        const cases = await getWithRelations(db.cases.where("case_id").anyOf(Array.from(caseIds)));
        this.cases = ObjectRelationalMapper.arrayToMap(cases, "case_id");
        const outbreaks = await getOutbreaksForPathogenId(activePathogen.id);
        this.outbreaks = ObjectRelationalMapper.arrayToMap(outbreaks);
        return this.collectImportedAndPersistedCases();
    }

    private collectImportedAndPersistedCases() {
        const casesToUpload: CaseImports = {};

        for (let i = 0; i < this.data.length; i++) {
            const row = this.data[i];
            const persistedCase = this.cases?.get(row[0]);
            const importedCase = {
                fasta_id: row[1] !== "" ? row[1] : null,
                groups: this.collectNewGroups(row, persistedCase),
                outbreak: row[3] !== "" ? row[3] : null,
                registered_at: parseGermanDateFormat(row[2]),
            } satisfies CaseImport;
            if (persistedCase) {
                persistedCase.outbreak = this.outbreaks?.get(persistedCase.outbreak_id) ?? null;

                if (this.importedCaseEqualsPersistedCase(importedCase, persistedCase)) continue;
            }
            casesToUpload[row[0]] = { imported: importedCase, persisted: persistedCase ?? null, import: true };
        }

        return casesToUpload;
    }

    /**
     * Detect if groups are remaining or new to the existing case or not.
     * @param row
     * @param existingCase
     * @returns
     */
    private collectNewGroups(row: string[], existingCase: CaseWithRelationships | undefined) {
        const groups: { name: string; category: string; remaining: boolean }[] = [];

        for (let i = 4; i <= 6; i++) {
            if (row[i] !== "") {
                const group = { category: this.header[i], name: row[i], remaining: false };
                const groupExistsForCase = existingCase
                    ? existingCase.groups?.some((existingGroup) => {
                          return existingGroup.category?.name === group.category && existingGroup.name === group.name;
                      })
                    : false;
                group.remaining = groupExistsForCase ?? false;

                groups.push(group);
            }
        }
        return groups;
    }

    /**
     * Returns if an imported and a persisted case are equal in terms of fasta_id, case_id, groups and registered_at-date.
     * @param caseImport
     * @param existingCase
     * @returns
     */
    private importedCaseEqualsPersistedCase(caseImport: CaseImport, existingCase: CaseWithRelationships) {
        return (
            ((!caseImport.fasta_id && !existingCase.fasta_id) || caseImport.fasta_id === existingCase.fasta_id) &&
            ((!caseImport.outbreak && !existingCase.outbreak) || caseImport.outbreak === existingCase.outbreak?.name) &&
            caseImport.groups.filter((group) => !group.remaining).length === 0 &&
            caseImport.groups.length === existingCase.groups?.length &&
            formatDate(caseImport.registered_at) === formatDate(existingCase.registered_at)
        );
    }
}
