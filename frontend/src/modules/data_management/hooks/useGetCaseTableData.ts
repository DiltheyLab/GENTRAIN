import { useEffect, useState } from "react";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { CaseImport } from "@/modules/core/models/cases";

export const useGetCaseTableData = () => {
    const caseImports = useDataManagementStore((state) => state.caseImports);
    const [tableData, setTableData] = useState<CaseImport[]>([]);

    useEffect(() => {
        const cases: CaseImport[] = [];
        for (const caseId of Object.keys(caseImports)) {
            const currentCase = caseImports[caseId];
            currentCase.case_id = caseId;
            cases.push(currentCase);
        }
        setTableData(cases);
    }, [caseImports]);

    return tableData;
};
