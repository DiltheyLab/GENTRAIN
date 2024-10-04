import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { formatDate, parseGermanDateFormat } from "@/modules/core/helpers/dates";
import { db } from "@/modules/core/infrastructure/database";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { useCoreStore } from "@/modules/core/stores/core";
import { ValidationStrategy } from "@/modules/data_management/services/data_upload/validation/ValidationStrategy";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

const CASES_COLUMN_NAMES = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
export type CaseUpload = {
    case_id?: string;
    fasta_id: string;
    groups: { name: string; category: string }[];
    outbreak: string;
    registered_at: Date;
    upload: boolean;
};

export class CasesValidation extends ValidationStrategy {
    protected validate = async (data: Array<Array<string>>) => {
        const header = data[0];
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!this.isCasesHeaderValid(header, CASES_COLUMN_NAMES)) {
            throw new GentrainException("InvalidHeaderError");
        }
        // receive ids of cases already persisted in the db to throw an error containing case ids
        data = data.slice(1, data.length);

        data = (await this.filterAlreadyExistingCases(header, data)) ?? [];
        useDataManagementStore.getState().setCaseSelectionActive(true);
        for (const row of data) {
            useDataManagementStore.getState().changeCaseUpload(row[0], {
                fasta_id: row[1],
                groups: this.collectGroups(header, row),
                outbreak: row[3],
                registered_at: parseGermanDateFormat(row[2]),
                upload: true,
            } satisfies CaseUpload);
        }
        return {
            data: data,
        };
    };

    private collectGroups = (header: string[], row: string[]) => {
        const groups: { name: string; category: string }[] = [];
        for (let i = 4; i <= 6; i++) {
            if (row[i] !== "") {
                groups.push({ category: header[i], name: row[i] });
            }
        }
        return groups;
    };

    private isCasesHeaderValid = (header: string[], columnNames: string[]) => {
        // exclude additional category columns from header validation
        const requiredHeaderColumnNames = header.slice(0, CASES_COLUMN_NAMES.length);
        return (
            requiredHeaderColumnNames.length === columnNames.length &&
            requiredHeaderColumnNames.every((value, index) => value === columnNames[index])
        );
    };

    private filterAlreadyExistingCases = async (header: string[], data: Array<Array<string>>) => {
        const activePathogen = useCoreStore.getState().activePathogen;
        if (!activePathogen) {
            return;
        }

        const caseIds = data.map((row) => row[0]);
        const cases = await db.cases.where("case_id").anyOf(Array.from(caseIds)).toArray();
        const caseMap = new Map<string, CaseWithRelationships>();
        for (const caseData of cases) {
            caseMap.set(caseData.case_id, caseData);
        }

        const outbreaks = await db.outbreaks.where("pathogen_id").equals(activePathogen.id).toArray();
        const outbreakMap = new Map<number, OutbreakSchema>();
        for (const outbreak of outbreaks) {
            outbreakMap.set(outbreak.id, outbreak);
        }

        const casesToUpload = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const existingCase = caseMap.get(row[0]);
            if (existingCase) {
                existingCase.outbreak = existingCase.outbreak_id ? outbreakMap.get(existingCase.outbreak_id) : null;
                const caseUpload = {
                    fasta_id: row[1],
                    groups: this.collectGroups(header, row),
                    outbreak: row[3],
                    registered_at: parseGermanDateFormat(row[2]),
                    upload: true,
                } satisfies CaseUpload;
                if (!this.caseUploadEqualsExistingCase(caseUpload, existingCase)) {
                    useDataManagementStore.getState().addExistingCase(row[0], existingCase, caseUpload);
                }
                continue;
            }
            casesToUpload.push(row);
        }

        return casesToUpload;
    };

    private caseUploadEqualsExistingCase = (caseUpload: CaseUpload, existingCase: CaseWithRelationships) => {
        return (
            ((!caseUpload.fasta_id && !caseUpload.fasta_id) || caseUpload.fasta_id === existingCase.fasta_id) &&
            ((!caseUpload.outbreak && !caseUpload.outbreak) || caseUpload.outbreak === existingCase.outbreak?.name) &&
            formatDate(caseUpload.registered_at) === formatDate(existingCase.registered_at)
        );
    };
}
