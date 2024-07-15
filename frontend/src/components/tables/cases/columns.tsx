import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { CaseSchema } from "@/database/cases";

export const columns: ColumnDef<CaseSchema>[] = [
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
        accessorKey: "case_id",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Case Id" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("case_id")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "sample_id",
        accessorFn: (row) => row.sample_id ?? null,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sample Id" />,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue("sample_id") ?? ""}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "date",
        accessorFn: (row) => row.date.toString(),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Sample Datum" />,
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue("date")}</span>
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
