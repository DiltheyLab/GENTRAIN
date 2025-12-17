import { toast } from "@/modules/core/components/ui/UseToast";
import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { formatDate, parseGermanDateFormat } from "@/modules/core/helpers/dates";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { CaseImport, caseImportRules, CaseWithRelationships, getWithRelations } from "@/modules/core/models/cases";
import { getOutbreaksForPathogenId, OutbreakSchema } from "@/modules/core/models/outbreaks";
import { ObjectRelationalMapper } from "@/modules/core/services/database/ObjectRelationalMapper";
import { useCoreStore } from "@/modules/core/stores/core";
import { ValidationStrategy } from "@/modules/data_management/services/data_import/validation/ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { CaseImports } from "@/modules/data_management/types/import";
import { GroupWithRelationships } from "@/modules/core/models/groups";
import { z } from "zod";

const COLUMNS = {
    case_id: {
        required: true,
        names: [
            "Fall ID", // Gentrain
            "Aktenzeichen", // Survnet
            "fallFallkennzeichen", //ISGA
        ],
    },
    registered_at: {
        required: true,
        names: [
            "Registrierungsdatum", // Gentrain
            "Meldedatum", // Survnet
            "fallMeldedatum", // ISGA
        ],
    },
    fasta_id: { required: false, names: ["Sequenz ID"] },
    outbreak: {
        required: false,
        names: [
            "Ausbruch", // Gentrain
            "AusbruchInfo_NameGA", // Survnet
            "AusbruchInfo_InternalName", // Survnet
            "AusbruchInfo_NameLS", // Survnet
            "AusbruchInfo_NameRKI", // Survnet
            "AusbruchInfo_GuidRecord", // Survnet
            "AusbruchInfo_InterneRef", // Survnet
            "ausbruchAktenzeichen", // ISGA
            "ausbruchId", // ISGA
        ],
    },
    infected_by: { required: false, names: ["Angesteckt bei", "AngestecktBei"] },
    first_name: {
        required: false,
        names: [
            "Vorname", // Gentrain
            "PersonVorname", // Survnet
            "persVorname", // ISGA
        ],
    },
    last_name: {
        required: false,
        names: [
            "Nachname", // Gentrain
            "PersonFamilienname", // Survnet
            "persName", // ISGA
        ],
    },
    city: {
        required: false,
        names: [
            "Ort", // Gentrain
            "PersonOrt", // Survnet
            "persOrt", // ISGA
        ],
    },
    zip_code: {
        required: false,
        names: [
            "PLZ", // Gentrain
            "PersonPLZ", // Survnet
        ],
    },
    street: {
        required: false,
        names: [
            "Straße", // Gentrain
            "PersonStrasse", // Survnet
            "persStrasse", // ISGA
        ],
    },
    street_number: {
        required: false,
        names: [
            "persHnr", // ISGA
        ],
    },
};

export class CasesValidation extends ValidationStrategy {
    protected data: { [key: string]: string }[] = [];
    protected header: string[] = [];
    protected outbreaks?: Map<any, OutbreakSchema>;
    protected cases?: Map<string, CaseWithRelationships>;

    public collectData(data: { columns: string[]; rows: { [key: string]: string }[] }) {
        this.header = data.columns;
        this.data = data.rows;
    }

    protected async validate() {
        // Check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!this.isHeaderValid(COLUMNS)) {
            throw new GentrainException("InvalidHeaderError");
        }
        // Receive ids of cases already persisted in the db to throw an error containing case ids
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
        return { data: this.data };
    }

    private async collectCaseImports() {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            throw new GentrainException("InvalidPathogenSelection");
        }

        const caseIds = this.data.map((row) => {
            // find the case id by iterating over all possible case id column names
            // since the column is required it is not possible that this field is empty
            let caseId = "";
            for (const caseIdColumnName of COLUMNS.case_id.names) {
                if (row[caseIdColumnName] && row[caseIdColumnName] !== "") {
                    caseId = row[caseIdColumnName];
                    break;
                }
            }
            return caseId;
        });

        const existingCases = await getWithRelations(db.cases.where("case_id").anyOf(Array.from(caseIds)));
        // We only import a case if the case_id does not exist for any other pathogen yet
        // Therefore we filter out case_ids that are already existing for other pathogens
        // However if a case_id exists for the active pathogen we want to check for changes
        const existingCasesForOtherPathogens = existingCases
            .filter((existingCase) => existingCase.pathogen_id !== activePathogen.id)
            .map((existingCase) => existingCase.case_id);
        const caseIdsToImport = caseIds.filter((caseId) => !existingCasesForOtherPathogens.includes(caseId));
        const existingCasesToImport = existingCases.filter(
            (existingCase) => !existingCasesForOtherPathogens.includes(existingCase.case_id)
        );
        this.cases = ObjectRelationalMapper.arrayToMap(existingCasesToImport, "case_id");
        const outbreaks = await getOutbreaksForPathogenId(activePathogen.id);
        this.outbreaks = ObjectRelationalMapper.arrayToMap(outbreaks);
        return this.collectImportedAndPersistedCases(caseIdsToImport);
    }

    private collectImportedAndPersistedCases(caseIdsToImport: string[]) {
        const casesToUpload: CaseImports = {};
        const failedCaseImports: { [caseId: string]: string[] } = {};
        const categoryColumnNames = this.getCategoryColumnNames();
        for (let i = 0; i < this.data.length; i++) {
            const row = this.data[i];
            const caseId = this.getCellValueForColumn(row, COLUMNS.case_id);
            // Skip the following steps if a case_id is not marked for import
            // (the case_id already exists for another pathogen yet)
            if (!caseId || !caseIdsToImport.includes(caseId)) {
                continue;
            }
            const persistedCase = this.cases?.get(this.getCellValueForColumn(row, COLUMNS.case_id, false)!);
            const registeredAt = this.getCellValueForColumn(row, COLUMNS.registered_at, false);
            try {
                const importedCase = caseImportRules.parse({
                    fasta_id: this.getCellValueForColumn(row, COLUMNS.fasta_id),
                    groups: this.getGroupCellValues(row, categoryColumnNames, persistedCase),
                    outbreak: this.getCellValueForColumn(row, COLUMNS.outbreak),
                    infected_by: this.getCellValueForColumn(row, COLUMNS.infected_by),
                    first_name: this.getCellValueForColumn(row, COLUMNS.first_name),
                    last_name: this.getCellValueForColumn(row, COLUMNS.last_name),
                    city: this.getCellValueForColumn(row, COLUMNS.city),
                    zip_code: this.getCellValueForColumn(row, COLUMNS.zip_code),
                    street: this.getCellValueForColumn(row, COLUMNS.street),
                    street_number: this.getCellValueForColumn(row, COLUMNS.street_number),
                    registered_at: parseGermanDateFormat(registeredAt!),
                } satisfies CaseImport);
                if (persistedCase) {
                    persistedCase.outbreak = this.outbreaks?.get(persistedCase.outbreak_id) ?? null;
                    persistedCase.groups = persistedCase.groups ?? [];
                    if (this.importedCaseEqualsPersistedCase(importedCase, persistedCase)) continue;
                }
                casesToUpload[caseId!] = {
                    imported: importedCase,
                    persisted: persistedCase ?? null,
                    import: true,
                };
            } catch (err) {
                console.log(err);
                if (err instanceof z.ZodError && caseId) {
                    const errorPaths = err.errors.map((err) => err.path.join("."));
                    failedCaseImports[caseId] = errorPaths;
                }
                continue;
            }
        }
        useDataManagementStore.getState().setFailedCaseImports(failedCaseImports);
        return casesToUpload;
    }

    /**
     * Returns if an imported and a persisted case are equal in terms of fasta_id, case_id, groups and registered_at-date.
     * @param caseImport
     * @param existingCase
     * @returns
     */
    private importedCaseEqualsPersistedCase(caseImport: CaseImport, existingCase: CaseWithRelationships) {
        return (
            this.fieldIsEqual(`${caseImport.street} ${caseImport.street_number ?? ""}`.trim(), existingCase.street) &&
            this.fieldIsEqual(caseImport.zip_code, existingCase.zip_code) &&
            this.fieldIsEqual(caseImport.city, existingCase.city) &&
            this.fieldIsEqual(caseImport.first_name, existingCase.first_name) &&
            this.fieldIsEqual(caseImport.last_name, existingCase.last_name) &&
            this.fieldIsEqual(caseImport.fasta_id, existingCase.fasta_id) &&
            this.fieldIsEqual(caseImport.infected_by, existingCase.infected_by) &&
            this.fieldIsEqual(caseImport.outbreak, existingCase.outbreak?.name) &&
            this.fieldIsEqual(formatDate(caseImport.registered_at), formatDate(existingCase.registered_at)) &&
            this.groupsAreEqual(caseImport.groups, existingCase.groups)
        );
    }

    private groupsAreEqual(
        importedGroups: {
            name: string;
            category: string;
            remaining?: boolean;
        }[],
        existingGroups: GroupWithRelationships[] | null | undefined
    ) {
        return (
            importedGroups.filter((group) => !group.remaining).length === 0 &&
            importedGroups.length === existingGroups?.length
        );
    }

    private getGroupCellValues(
        row: { [key: string]: string },
        categoryColumnNames: string[],
        existingCase: CaseWithRelationships | undefined
    ) {
        const groupValues = categoryColumnNames
            .filter((categoryColumnName) => row[`Kategorie:${categoryColumnName}`])
            .map((categoryColumnName) => {
                const groupName = row[`Kategorie:${categoryColumnName}`];
                const remaining = existingCase
                    ? existingCase.groups?.some((existingGroup) => {
                          return (
                              existingGroup.category?.name === categoryColumnName && existingGroup.name === groupName
                          );
                      })
                    : false;
                return { name: groupName, category: categoryColumnName, remaining: remaining };
            });
        return groupValues;
    }

    private getCategoryColumnNames() {
        return this.header
            .filter((columnName: string) => columnName.includes("Kategorie:"))
            .map((categoryColumnNames) => categoryColumnNames.replace("Kategorie:", ""));
    }

    private fieldIsEqual(
        importedField: string | number | null | undefined,
        existingField: string | number | null | undefined
    ) {
        return (!importedField && !existingField) || importedField === existingField;
    }
}
