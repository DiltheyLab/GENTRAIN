import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { CaseSchema, CaseImport } from "@/modules/core/models/cases";

export const useGetCaseImports = () => {
    const caseImports = useDataManagementStore((state) => state.caseImports);
    const existingUploads = useDataManagementStore((state) => state.existingCases);
    const [imports, setImports] = useState<{
        create: { [caseId: string]: CaseImport } | null;
        update: {
            [caseId: string]: {
                existingCase: CaseSchema;
                caseImport: CaseImport;
            };
        } | null;
    }>({ create: null, update: null });

    useEffect(() => {
        const create = Object.keys(caseImports).length > 0 ? caseImports : null;
        const update = Object.keys(existingUploads).length > 0 ? existingUploads : null;
        setImports({ create: create, update: update });
    }, [caseImports, existingUploads]);

    return imports;
};
