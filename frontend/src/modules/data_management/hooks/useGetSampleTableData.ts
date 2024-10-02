import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SampleUpload } from "../services/data_upload/validation/SamplesValidation";

export const useGetSampleTableData = () => {
    const sampleUploads = useDataManagementStore((state) => state.sampleUploads);
    const [tableData, setTableData] = useState<SampleUpload[]>([]);

    useEffect(() => {
        const cases: SampleUpload[] = [];
        for (const fastaId of Object.keys(sampleUploads)) {
            const currentSample = {
                fasta_id: fastaId,
                case_id: sampleUploads[fastaId].case_id,
                status: sampleUploads[fastaId].status,
            };
            cases.push(currentSample);
        }
        setTableData(cases);
    }, [sampleUploads]);

    return tableData;
};
