import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { SampleImport } from "@/modules/core/models/samples";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ColumnDef } from "@tanstack/react-table";

export const sampleSelectionColumns: ColumnDef<SampleImport>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value);
                    table.getRowModel().rows.forEach((row) => {
                        useDataManagementStore
                            .getState()
                            .changeSampleImport(row.original.fasta_id!, { import: !!value });
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
                        useDataManagementStore
                            .getState()
                            .changeSampleImport(row.original.fasta_id!, { import: !!value });
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
        cell: ({ row }) => <>{row.original.fasta_id}</>,
    },
    {
        accessorKey: "case_id",
        header: "Fall",
        cell: ({ row }) => <>{row.original.sequence_length}</>,
    },
];

export const viralColumns: ColumnDef<SampleImport>[] = [
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

export const bacterialColumns: ColumnDef<SampleImport>[] = [
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
