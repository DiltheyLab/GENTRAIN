import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { DataTable } from "@/modules/core/components/tables/DataTable";
import { useGetSequenceTableData } from "@/modules/data_management/hooks/useGetSequenceTableData";
import { sampleImportFilterFn } from "@/modules/data_management/helpers/dataTable";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { bacterialColumns, sampleSelectionColumns, viralColumns } from "./sequenceSelectionColumns";

export function SequenceSelection() {
    const sampleTableData = useGetSequenceTableData();
    const changeSequenceImport = useDataManagementStore((state) => state.changeSequenceImport);
    const activePathogen = useCoreStore((state) => state.activePathogen);

    return (
        <>
            {sampleTableData && (
                <DataTable
                    data={sampleTableData}
                    columns={sampleSelectionColumns.concat(
                        activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? viralColumns : bacterialColumns
                    )}
                    pageSize={5}
                    filterFn={sampleImportFilterFn}
                    onRowClick={(row: any) => {
                        if (!row.original.fasta_id) return;
                        changeSequenceImport(row.original.fasta_id!, { import: !row.getIsSelected() });
                        row.toggleSelected(!row.getIsSelected());
                    }}
                    preselectRows
                    selectionLabel="Sequenzen"
                />
            )}
        </>
    );
}
