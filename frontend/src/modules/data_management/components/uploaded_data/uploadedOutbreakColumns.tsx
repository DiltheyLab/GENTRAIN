import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { OutbreakEditDialog } from "./OutbreakEditDialog";

export const uploadedOutbreakColumns: ColumnDef<OutbreakSchema>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fall
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <p className="capitalize font-medium">{row.original.name}</p>,
    },
    {
        accessorKey: "case_count",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fall
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.case_count,
    },
    {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        header: () => <p>Aktionen</p>,
        cell: ({ row }) => <OutbreakEditDialog row={row} />,
    },
];
