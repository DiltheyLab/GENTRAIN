import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { CaseUpload } from "../services/data_upload/validation/CasesValidation";
import { CaseSchema } from "@/modules/core/models/cases";

export const useGetExistingCasesTableData = () => {
    const existingCases = useDataManagementStore((state) => state.existingCases);
    const [tableData, setTableData] = useState<{ existingCase: CaseSchema; caseUpload: CaseUpload }[] | null>(null);

    useEffect(() => {
        const cases: { existingCase: CaseSchema; caseUpload: CaseUpload }[] = [];
        for (const caseId of Object.keys(existingCases)) {
            const caseUpload = existingCases[caseId].caseUpload;
            caseUpload.case_id = caseId;
            cases.push({ existingCase: existingCases[caseId].existingCase, caseUpload: caseUpload });
        }
        if (cases.length > 0) {
            setTableData(cases);
        }
    }, [existingCases]);

    return tableData;
};
