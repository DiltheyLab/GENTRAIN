import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SampleImport } from "@/modules/core/models/samples";

export const useGetSampleImports = () => {
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const [imports, setImports] = useState<{ [fastaId: string]: SampleImport } | null>(null);

    useEffect(() => {
        setImports(Object.keys(sampleImports).length > 0 ? sampleImports : null);
    }, [sampleImports]);

    return imports;
};
