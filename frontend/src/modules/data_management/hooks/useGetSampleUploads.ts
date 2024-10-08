import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SampleUpload } from "../services/data_upload/validation/SamplesValidation";

export const useGetSampleUploads = () => {
    const sampleUploads = useDataManagementStore((state) => state.sampleUploads);
    const [uploads, setUploads] = useState<{ [fastaId: string]: SampleUpload } | null>(null);

    useEffect(() => {
        setUploads(Object.keys(sampleUploads).length > 0 ? sampleUploads : null);
    }, [sampleUploads]);

    return uploads;
};
