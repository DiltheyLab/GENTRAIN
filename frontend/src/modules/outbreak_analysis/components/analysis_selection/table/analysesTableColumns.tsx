import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/modules/core/components/ui/Dropdown-menu";
import { toast } from "@/modules/core/components/ui/UseToast";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { formatDate } from "@/modules/core/helpers/dates";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { db } from "@/modules/core/infrastructure/database";

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
        cell: ({ row }) => <p className="capitalize font-medium">{row.original.name}</p>,
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
            return <p className="capitalize font-medium">{formatDate(created_at)}</p>;
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
            return <p className="capitalize font-medium"> {selectedOutbreak ? selectedOutbreak.name : "-"}</p>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        cell: ({ row }) => {
            const deleteAnalysis = async () => {
                try {
                    await db.analyses.delete(row.original.id);
                } catch (error) {
                    toast({
                        title: "Fehler beim Löschen der Analyse",
                        description: "Die Analyse konnte nicht gelöscht werden. Bitte versuche es erneut.",
                        duration: 10000,
                        variant: "destructive",
                    });
                    console.error("Error while deleting analysis", error);
                }
            };
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={deleteAnalysis}>
                            Entfernen
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
