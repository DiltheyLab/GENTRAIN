import { Button } from "@/modules/core/components/ui/Button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { OutbreakEditDialog } from "./OutbreakEditDialog";

export const uploadedOutbreakColumns: ColumnDef<OutbreakSchema>[] = [
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
                    Fälle
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.case_count,
    },
    {
        accessorKey: "sequenced_case_count",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sequenzierte Fälle
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => row.original.sequenced_case_count,
    },
    {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        header: () => <p>Aktionen</p>,
        cell: ({ row }) => <OutbreakEditDialog row={row} />,
    },
];
