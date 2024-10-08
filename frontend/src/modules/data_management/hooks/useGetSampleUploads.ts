import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SampleImport } from "@/modules/core/models/samples";

export const useGetSampleUploads = () => {
    const sampleUploads = useDataManagementStore((state) => state.sampleUploads);
    const [uploads, setUploads] = useState<{ [fastaId: string]: SampleImport } | null>(null);

    useEffect(() => {
        setUploads(Object.keys(sampleUploads).length > 0 ? sampleUploads : null);
    }, [sampleUploads]);

    return uploads;
};
