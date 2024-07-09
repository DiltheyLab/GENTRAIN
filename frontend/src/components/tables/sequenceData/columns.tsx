import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { SampleSchema } from "@/database/samples";

export const columns: ColumnDef<SampleSchema>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "fasta_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fasta Id" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("fasta_id")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "group",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Gruppe" />,
        cell: ({ row }) => {
            /*             const label = labels.find((label) => label.value === row.original.label);
             */
            return (
                <div className="flex space-x-2">
                    {/*                     {label && <Badge variant="outline">{label.label}</Badge>}
                     */}
                    <span className="max-w-[500px] truncate font-medium">{row.getValue("group")}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "sampled_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sample Datum" />,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue("sampled_at")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "location_sequencing_lab",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sequencing Lab" />,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("location_sequencing_lab")}
                    </span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "location_sending_lab",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sending Lab" />,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue("location_sending_lab")}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
