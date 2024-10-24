import { toast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { formatDate, parseGermanDateFormat } from "@/modules/core/helpers/dates";
import { db } from "@/modules/core/infrastructure/database";
import { CaseImport, CaseWithRelationships, getWithRelations } from "@/modules/core/models/cases";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { ObjectRelationalMapper } from "@/modules/core/services/database/ObjectRelationalMapper";
import { useCoreStore } from "@/modules/core/stores/core";
import { ValidationStrategy } from "@/modules/data_management/services/data_import/validation/ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

const CASES_COLUMN_NAMES = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];

export class CasesValidation extends ValidationStrategy {
    protected async validate(data: Array<Array<string>>) {
        const header = data[0];
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!this.isCasesHeaderValid(header)) {
            throw new GentrainException("InvalidHeaderError");
        }
        // receive ids of cases already persisted in the db to throw an error containing case ids
        data = data.slice(1, data.length);

        const caseImports = await this.collectCaseImports(header, data);
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
            data: data,
        };
    }

    private isCasesHeaderValid(header: string[]) {
        // exclude additional category columns from header validation
        const requiredHeaderColumnNames = header.slice(0, CASES_COLUMN_NAMES.length);
        // header is valid if all requiredheader columns are present and the flexible category count is not higher than 3
        return (
            header.length <= CASES_COLUMN_NAMES.length + 3 &&
            requiredHeaderColumnNames.length === CASES_COLUMN_NAMES.length &&
            requiredHeaderColumnNames.every((value, index) => value === CASES_COLUMN_NAMES[index])
        );
    }

    private async collectCaseImports(header: string[], data: Array<Array<string>>) {
        const activePathogen = useCoreStore.getState().activePathogen;

        if (!activePathogen) {
            return {};
        }

        const caseIds = data.map((row) => row[0]);

        const caseMap = ObjectRelationalMapper.arrayToMap(
            await getWithRelations(db.cases.where("case_id").anyOf(Array.from(caseIds)))
        );

        const outbreaks = await db.outbreaks.where("pathogen_id").equals(activePathogen.id).toArray();
        const outbreakMap = new Map<number, OutbreakSchema>();
        for (const outbreak of outbreaks) {
            outbreakMap.set(outbreak.id, outbreak);
        }

        const casesToUpload: {
            [caseId: string]: {
                imported: CaseImport;
                persisted: CaseWithRelationships | null;
                import: boolean;
            };
        } = {};

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const persistedCase = caseMap.get(row[0]);
            const importedCase = {
                fasta_id: row[1] !== "" ? row[1] : null,
                groups: this.collectNewGroups(header, row, persistedCase),
                outbreak: row[3] !== "" ? row[3] : null,
                registered_at: parseGermanDateFormat(row[2]),
            } satisfies CaseImport;

            if (persistedCase) {
                persistedCase.outbreak = persistedCase.outbreak_id ? outbreakMap.get(persistedCase.outbreak_id) : null;
                if (this.importedCaseEqualsPersistedCase(importedCase, persistedCase)) continue;
            }
            casesToUpload[row[0]] = { imported: importedCase, persisted: persistedCase ?? null, import: true };
        }

        return casesToUpload;
    }

    /**
     * Detect if groups are remaining or new to the existing case or not.
     * @param header
     * @param row
     * @param existingCase
     * @returns
     */
    private collectNewGroups(header: string[], row: string[], existingCase: CaseWithRelationships | undefined) {
        const groups: { name: string; category: string; remaining: boolean }[] = [];

        for (let i = 4; i <= 6; i++) {
            if (row[i] !== "") {
                const group = { category: header[i], name: row[i], remaining: false };
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
