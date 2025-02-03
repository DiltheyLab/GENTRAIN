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

const COLUMNS = {
    case_id: { required: true, names: ["Fall ID", "Aktenzeichen"] },
    registered_at: { required: true, names: ["Registrierungsdatum", "Meldedatum"] },
    fasta_id: { required: false, names: ["Sequenz ID"] },
    outbreak: { required: false, names: ["Ausbruch"] },
    infected_by: { required: false, names: ["Angesteckt bei", "AngestecktBei"] },
    first_name: { required: false, names: ["Vorname", "PersonVorname"] },
    last_name: { required: false, names: ["Nachname", "PersonFamilienname"] },
    city: { required: false, names: ["Ort", "PersonOrt"] },
    zip_code: { required: false, names: ["PLZ", "PersonPLZ"] },
    street: { required: false, names: ["Straße", "PersonStrasse"] },
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
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!this.isHeaderValid(COLUMNS)) {
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

        return { data: this.data };
    }

    private async collectCaseImports() {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            return {};
        }

        const caseIds = this.data.map((row) => row["Fall ID"]);
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
            const persistedCase = this.cases?.get(this.getCellValueForColumn(row, COLUMNS.case_id, false)!);
            const registeredAt = this.getCellValueForColumn(row, COLUMNS.registered_at, false);
            const importedCase = {
                fasta_id: this.getCellValueForColumn(row, COLUMNS.fasta_id),
                groups: [],
                outbreak: this.getCellValueForColumn(row, COLUMNS.outbreak),
                infected_by: this.getCellValueForColumn(row, COLUMNS.infected_by),
                first_name: this.getCellValueForColumn(row, COLUMNS.first_name),
                last_name: this.getCellValueForColumn(row, COLUMNS.last_name),
                city: this.getCellValueForColumn(row, COLUMNS.city),
                zip_code: this.getCellValueForColumn(row, COLUMNS.zip_code),
                street: this.getCellValueForColumn(row, COLUMNS.street),
                registered_at: parseGermanDateFormat(registeredAt!),
            } satisfies CaseImport;
            if (persistedCase) {
                persistedCase.outbreak = this.outbreaks?.get(persistedCase.outbreak_id) ?? null;
                persistedCase.groups = persistedCase.groups ?? [];

                if (this.importedCaseEqualsPersistedCase(importedCase, persistedCase)) continue;
            }
            casesToUpload[this.getCellValueForColumn(row, COLUMNS.case_id)!] = {
                imported: importedCase,
                persisted: persistedCase ?? null,
                import: true,
            };
        }
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
            caseImport.street === existingCase.street &&
            caseImport.zip_code === existingCase.zip_code &&
            caseImport.city === existingCase.city &&
            caseImport.first_name === existingCase.first_name &&
            caseImport.last_name === existingCase.last_name &&
            ((!caseImport.fasta_id && !existingCase.fasta_id) || caseImport.fasta_id === existingCase.fasta_id) &&
            ((!caseImport.outbreak && !existingCase.outbreak) || caseImport.outbreak === existingCase.outbreak?.name) &&
            caseImport.groups.filter((group) => !group.remaining).length === 0 &&
            caseImport.groups.length === existingCase.groups?.length &&
            formatDate(caseImport.registered_at) === formatDate(existingCase.registered_at)
        );
    }
}
