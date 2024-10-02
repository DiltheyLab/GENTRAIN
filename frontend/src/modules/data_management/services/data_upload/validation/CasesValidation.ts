import { GentrainException } from "@/modules/core/exceptions/GentrainException";
import { db } from "@/modules/core/infrastructure/database";
import { ValidationStrategy } from "@/modules/data_management/services/data_upload/validation/ValidationStrategy";

const CASES_COLUMN_NAMES = ["Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"];
export type CaseUpload = {
    case_id?: string;
    fasta_id: string;
    groups: { name: string; category: string }[];
    outbreak: string;
    registered_at: string;
    status: string;
};

export class CasesValidation extends ValidationStrategy {
    protected validate = async (data: Array<Array<string>>) => {
        const header = data[0];
        //check if required header columns (additional category columns excluded) is exactly the same as columnNameRequirements
        if (!this.isCasesHeaderValid(header, CASES_COLUMN_NAMES)) {
            throw new GentrainException("InvalidHeaderError");
        }
        // receive ids of cases already persisted in the db to throw an error containing case ids
        const existingCases = await this.getAlreadyExistingCases(data.slice(1, data.length));
        // existingCases is undefined if no pathogen is active
        if (!existingCases) {
            throw new GentrainException("InvalidPathogenSelection");
        }
        if (existingCases.length > 0) {
            throw new GentrainException("CasesAlreadyExist", existingCases);
        }
        this.dataManagementState.setCaseSelectionActive(true);
        data = data.slice(1, data.length);
        for (const row of data) {
            this.dataManagementState.changeCaseUpload(row[0], {
                fasta_id: row[1],
                groups: this.collectGroups(header, row),
                outbreak: row[3],
                registered_at: row[2],
                status: "selected",
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

    private getAlreadyExistingCases = async (data: Array<Array<string>>) => {
        let existingCases = [];
        const activePathogen = this.coreState.activePathogen;
        if (!activePathogen) {
            return;
        }
        for (const row of data) {
            const caseCount = await db.cases.where("[case_id+pathogen_id]").equals([row[0], activePathogen.id]).count();
            if (caseCount > 0) {
                existingCases.push(row[0]);
            }
        }
        return existingCases;
    };
}
