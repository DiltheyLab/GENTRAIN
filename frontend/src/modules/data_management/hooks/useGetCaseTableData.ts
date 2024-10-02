import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { CaseUpload } from "../services/data_upload/validation/CasesValidation";

export const useGetCaseTableData = () => {
    const caseUploads = useDataManagementStore((state) => state.caseUploads);
    const [tableData, setTableData] = useState<CaseUpload[]>([]);

    useEffect(() => {
        const cases: CaseUpload[] = [];

        for (const caseId of Object.keys(caseUploads)) {
            const currentCase = caseUploads[caseId];
            currentCase.case_id = caseId;
            cases.push(currentCase);
        }
        setTableData(cases);
    }, [caseUploads]);

    return tableData;
};
