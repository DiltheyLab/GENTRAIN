import { useEffect, useState } from "react";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";

export const useGetCaseTableData = () => {
    const caseImports = useDataManagementStore((state) => state.caseImports);
    const [tableData, setTableData] = useState<CaseImport[] | (CaseImport & { existingCase: CaseWithRelationships })[]>(
        []
    );

    useEffect(() => {
        const cases: CaseImport[] = [];
        for (const caseId of Object.keys(caseImports)) {
            caseImports[caseId].imported.case_id = caseId;
            cases.push({
                ...{ existingCase: caseImports[caseId].persisted ?? null },
                ...caseImports[caseId].imported,
            });
        }
        setTableData(cases);
    }, [caseImports]);

    return tableData;
};
