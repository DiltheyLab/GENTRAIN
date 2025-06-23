import { useEffect, useState } from "react";
import { useDataManagementStore } from "../stores/dataManagement";
import { SequenceImport } from "@/modules/core/models/sequence_analyses";

export const useGetSequenceTableData = () => {
    const sequenceImports = useDataManagementStore((state) => state.sequenceImports);
    const [tableData, setTableData] = useState<SequenceImport[]>([]);

    useEffect(() => {
        const sequences: SequenceImport[] = [];
        for (const fastaHash of Object.keys(sequenceImports)) {
            const sequence = sequenceImports[fastaHash];
            const currentSequence = {
                fasta_id: sequence.fasta_id,
                sequence_length: sequence.sequence_length,
                n_count: sequence.n_count,
                ambiguity_character_count: sequence.ambiguity_character_count,
                contig_count: sequence.contig_count,
                first_contig_length: sequence.first_contig_length,
            } as SequenceImport;
            sequences.push(currentSequence);
        }
        setTableData(sequences);
    }, [sequenceImports]);
    return tableData;
};
