import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { CaseSchema, CaseImport } from "@/modules/core/models/cases";

export const useGetCaseImports = () => {
    const caseImports = useDataManagementStore((state) => state.caseImports);
    const [imports, setImports] = useState<{
        [caseId: string]: { imported: CaseImport; persisted: CaseSchema | null; import: boolean };
    }>({});

    useEffect(() => {
        setImports(caseImports);
    }, [caseImports]);

    return imports;
};
