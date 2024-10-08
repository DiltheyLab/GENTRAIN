import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { CaseSchema, CaseImport } from "@/modules/core/models/cases";

export const useGetCaseUploads = () => {
    const caseUploads = useDataManagementStore((state) => state.caseUploads);
    const existingUploads = useDataManagementStore((state) => state.existingCases);
    const [uploads, setUploads] = useState<{
        create: { [caseId: string]: CaseImport } | null;
        update: {
            [caseId: string]: {
                existingCase: CaseSchema;
                caseUpload: CaseImport;
            };
        } | null;
    }>({ create: null, update: null });

    useEffect(() => {
        const create = Object.keys(caseUploads).length > 0 ? caseUploads : null;
        const update = Object.keys(existingUploads).length > 0 ? existingUploads : null;
        setUploads({ create: create, update: update });
    }, [caseUploads, existingUploads]);

    return uploads;
};
