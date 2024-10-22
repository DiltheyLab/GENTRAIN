import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SampleImport } from "@/modules/core/models/samples";

export const useGetSampleTableData = () => {
    const sampleImports = useDataManagementStore((state) => state.sampleImports);
    const [tableData, setTableData] = useState<SampleImport[]>([]);

    useEffect(() => {
        const samples: SampleImport[] = [];
        for (const fastaId of Object.keys(sampleImports)) {
            const sample = sampleImports[fastaId].imported;
            const currentSample = {
                fasta_id: fastaId,
                case_id: sample.case_id,
                sequence: sample.sequence,
                sequence_length: sample.sequence_length,
                n_count: sample.n_count,
                ambiguity_character_count: sample.ambiguity_character_count,
                contig_count: sample.contig_count,
                first_contig_length: sample.first_contig_length,
            };
            samples.push(currentSample);
        }
        setTableData(samples);
    }, [sampleImports]);
    return tableData;
};
