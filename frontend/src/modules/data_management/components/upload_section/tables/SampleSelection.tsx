import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/modules/data_management/components/data_table/DataTable";
import { useGetSampleTableData } from "@/modules/data_management/hooks/useGetSampleTableData";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { sampleImportFilterFn } from "@/modules/data_management/helpers/dataTable";
import { SampleImport } from "@/modules/core/models/samples";
import { useCoreStore } from "@/modules/core/stores/core";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";

export function SampleSelection() {
    const sampleTableData = useGetSampleTableData();
    const changeSampleImport = useDataManagementStore((state) => state.changeSampleImport);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const columns: ColumnDef<SampleImport>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        table.getRowModel().rows.forEach((row) => {
                            changeSampleImport(row.original.fasta_id!, { upload: !!value });
                        });
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => {
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                            changeSampleImport(row.original.fasta_id!, { upload: !!value });
                        }}
                        aria-label="Select row"
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "fasta_id",
            header: "Sequenz",
            cell: ({ row }) => <>{row.getValue("fasta_id")}</>,
        },
        {
            accessorKey: "case_id",
            header: "Fall",
            cell: ({ row }) => <>{row.getValue("case_id")}</>,
        },
    ];

    const viralColumns: ColumnDef<SampleImport>[] = [
        {
            accessorKey: "sequence_length",
            header: "Sequenzlänge",
            cell: ({ row }) => <>{row.original.sequence_length}</>,
        },
        {
            accessorKey: "n_count",
            header: "Ns",
            cell: ({ row }) => <>{row.original.n_count}</>,
        },
        {
            accessorKey: "ambiguity_character_count",
            header: "IUPAC Ambiguity Characters",
            cell: ({ row }) => <>{row.original.ambiguity_character_count}</>,
        },
    ];

    const bacterialColumns: ColumnDef<SampleImport>[] = [
        {
            accessorKey: "contig_count",
            header: "Contigs",
            cell: ({ row }) => <>{row.original.contig_count}</>,
        },
        {
            accessorKey: "first_contig_length",
            header: "Länge des ersten Contigs",
            cell: ({ row }) => <>{row.original.first_contig_length}</>,
        },
    ];

    return (
        <>
            <DialogTitle>Sequenzen hinzufügen</DialogTitle>
            <DialogDescription>
                Folgende Sequenzen wurden in der Fastadatei gefunden. Alle ausgewählte Sequenzen werden hinzugefügt.
            </DialogDescription>
            <DataTable
                data={sampleTableData}
                columns={columns.concat(
                    activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? viralColumns : bacterialColumns
                )}
                pageSize={5}
                filterFn={sampleImportFilterFn}
                onRowClick={(row: any) => {
                    changeSampleImport(row.original.fasta_id, { upload: !row.original.upload });
                    row.toggleSelected(!row.getIsSelected());
                }}
                preselectRows
            />
        </>
    );
}
