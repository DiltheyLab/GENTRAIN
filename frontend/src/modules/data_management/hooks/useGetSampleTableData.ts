import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SampleImport } from "@/modules/core/models/samples";

export const useGetSampleTableData = () => {
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const [tableData, setTableData] = useState<SampleImport[]>([]);

    useEffect(() => {
        const cases: SampleImport[] = [];
        for (const fastaId of Object.keys(sampleImports)) {
            const currentSample = {
                fasta_id: fastaId,
                case_id: sampleImports[fastaId].case_id,
                status: sampleImports[fastaId].status,
                upload: sampleImports[fastaId].upload,
                sequence: sampleImports[fastaId].sequence,
            };
            cases.push(currentSample);
        }
        setTableData(cases);
    }, [sampleImports]);

    return tableData;
};
