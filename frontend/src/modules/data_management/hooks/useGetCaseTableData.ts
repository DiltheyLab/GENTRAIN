import { useEffect, useState } from "react";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { CaseImport } from "@/modules/core/models/cases";

export const useGetCaseTableData = () => {
    const caseUploads = useDataManagementStore((state) => state.caseUploads);
    const [tableData, setTableData] = useState<CaseImport[]>([]);

    useEffect(() => {
        const cases: CaseImport[] = [];
        for (const caseId of Object.keys(caseUploads)) {
            const currentCase = caseUploads[caseId];
            currentCase.case_id = caseId;
            cases.push(currentCase);
        }
        setTableData(cases);
    }, [caseUploads]);

    return tableData;
};
