import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { ContactImport } from "@/modules/core/models/contacts";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const contactSelectionColumns: ColumnDef<ContactImport>[] = [
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
                            .changeContactImport(row.original.contact_id!, { import: !!value });
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
                            .changeContactImport(row.original.contact_id!, { import: !!value });
                    }}
                    aria-label="Select row"
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "case_id_1",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fall 1
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <>{row.getValue("case_id_1")}</>,
    },
    {
        accessorKey: "case_id_2",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fall 2
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <>{row.getValue("case_id_2")}</>,
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Typ
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <>{row.getValue("type")}</>,
    },
    {
        accessorKey: "context",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Kontext
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <>{row.getValue("context")}</>,
    },
];
