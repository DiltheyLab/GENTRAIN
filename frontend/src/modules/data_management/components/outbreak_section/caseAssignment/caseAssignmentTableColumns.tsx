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
import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/modules/core/components/ui/HoverCard";
import { Separator } from "@/modules/core/components/ui/Separator";
import { formatDate } from "@/modules/core/helpers/dates";
import { CaseWithRelationships, deleteCaseByIdAndRecalculateDistances } from "@/modules/core/models/cases";
import { useCoreStore } from "@/modules/core/stores/core";
import i18next from "i18next";

export const caseAssignmentTableColumns: ColumnDef<CaseWithRelationships>[] = [
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
        accessorKey: "case_id",
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
        cell: ({ row }) => <p className="capitalize font-medium">{row.original.case_id}</p>,
    },

    {
        accessorKey: "outbreak_id",
        header: () => <p>Ausbruch</p>,
        cell: ({ row }) => {
            const outbreak = row.original.outbreak;
            return <>{outbreak?.name ?? i18next.t("clusterTypes.noOutbreakAssigned")}</>;
        },
    },

    {
        accessorKey: "registered_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Registrierungsdatum
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <p className="capitalize">{formatDate(row.original.registered_at)}</p>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const deleteCase = async () => {
                try {
                    await deleteCaseByIdAndRecalculateDistances(row.original.id);
                    await useCoreStore.getState().updateCasesWithRelationships();
                } catch (error) {
                    toast({
                        title: "Fall konnte nicht gelöscht werden.",
                        duration: 10000,
                        variant: "destructive",
                    });
                }
            };
            return (
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <PlusCircle className="h-5 w-5" />
                </Button>
            );
        },
    },
];
