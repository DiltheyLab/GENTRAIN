import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { CaseUpload } from "../services/data_upload/validation/CasesValidation";

export const useGetAlreadyExistingCasesTableData = () => {
    const alreadyExistingCases = useDataManagementStore((state) => state.alreadyExistingCases);
    const [tableData, setTableData] = useState<CaseUpload[] | null>(null);

    useEffect(() => {
        const cases: CaseUpload[] = [];
        for (const caseId of Object.keys(alreadyExistingCases)) {
            const currentCase = alreadyExistingCases[caseId];
            currentCase.case_id = caseId;
            cases.push(currentCase);
        }
        if (cases.length > 0) {
            setTableData(cases);
        }
    }, [alreadyExistingCases]);

    return tableData;
};
