import { useEffect, useState } from "react";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";

export const useGetExistingCasesTableData = () => {
    const existingCases = useDataManagementStore((state) => state.existingCases);
    const [tableData, setTableData] = useState<(CaseImport & { existingCase: CaseWithRelationships })[] | null>(null);

    useEffect(() => {
        const cases: (CaseImport & { existingCase: CaseWithRelationships })[] = [];
        for (const caseId of Object.keys(existingCases)) {
            const caseImport = existingCases[caseId].caseImport;
            caseImport.case_id = caseId;
            cases.push({ ...{ existingCase: existingCases[caseId].existingCase }, ...caseImport });
        }
        if (cases.length > 0) {
            setTableData(cases);
        }
    }, [existingCases]);

    return tableData;
};
