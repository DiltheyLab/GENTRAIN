import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SampleImport } from "@/modules/core/models/samples";

export const useGetSampleTableData = () => {
    const sampleUploads = useDataManagementStore((state) => state.sampleUploads);
    const [tableData, setTableData] = useState<SampleImport[]>([]);

    useEffect(() => {
        const cases: SampleImport[] = [];
        for (const fastaId of Object.keys(sampleUploads)) {
            const currentSample = {
                fasta_id: fastaId,
                case_id: sampleUploads[fastaId].case_id,
                status: sampleUploads[fastaId].status,
                upload: sampleUploads[fastaId].upload,
                sequence: sampleUploads[fastaId].sequence,
            };
            cases.push(currentSample);
        }
        setTableData(cases);
    }, [sampleUploads]);

    return tableData;
};
