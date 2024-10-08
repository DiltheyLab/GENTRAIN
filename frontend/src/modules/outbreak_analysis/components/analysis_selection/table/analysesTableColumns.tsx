import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatDate } from "@/modules/core/helpers/dates";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { TableActions } from "./TableActions";

export const columns: ColumnDef<AnalysisSchema>[] = [
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
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <p className="font-medium">{row.original.name}</p>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Erstellungsdatum
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },

        cell: ({ row }) => {
            const created_at = row.original.created_at;
            if (!created_at) return;
            return <p className="font-medium">{formatDate(created_at)}</p>;
        },
    },
    {
        accessorKey: "analysisSettings",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Analysierter Ausbruch
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const selectedOutbreak = row.original.analysisSettings.selectedOutbreak;
            return <p className="font-medium"> {selectedOutbreak ? selectedOutbreak.name : "-"}</p>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        header: () => <p>Aktionen</p>,
        cell: ({ row }) => <TableActions row={row} />,
    },
];
