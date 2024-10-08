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
                sequence_length: sampleImports[fastaId].sequence_length,
                n_count: sampleImports[fastaId].n_count,
                ambiguity_character_count: sampleImports[fastaId].ambiguity_character_count,
                contig_count: sampleImports[fastaId].contig_count,
                first_contig_length: sampleImports[fastaId].first_contig_length,
            };
            cases.push(currentSample);
        }
        setTableData(cases);
    }, [sampleImports]);

    return tableData;
};
