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
import { CaseWithRelationships, deleteCaseById } from "@/modules/core/models/cases";
import { useCoreStore } from "@/modules/core/stores/core";
import i18next from "i18next";
import { useDataManagementStore } from "../../stores/dataManagement";

export const caseTableColumns: ColumnDef<CaseWithRelationships>[] = [
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
        accessorKey: "fasta_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sequenz
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const sequenceAnalysis = row.original.sequence_analysis;
            if (sequenceAnalysis) {
                return (
                    <>
                        <p className="font-medium">{row.original.fasta_id}</p>
                        {sequenceAnalysis?.schema && <p>Schema: {sequenceAnalysis?.schema}</p>}
                        {sequenceAnalysis?.chewbbaca_version && (
                            <p>chewBBACA Version: {sequenceAnalysis?.chewbbaca_version}</p>
                        )}
                        {sequenceAnalysis?.nextclade_version && (
                            <p>Nextclade Version: {sequenceAnalysis?.nextclade_version}</p>
                        )}
                    </>
                );
            }

            return <div>{row.original.fasta_id ?? ""}</div>;
        },
    },
    {
        accessorKey: "outbreak_id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ausbruch
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const outbreak = row.original.outbreak;
            return <>{outbreak?.name ?? i18next.t("clusterTypes.noOutbreakAssigned")}</>;
        },
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nachname
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <>{row.original.last_name ?? ""}</>;
        },
    },
    {
        accessorKey: "first_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Vorname
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <>{row.original.first_name ?? ""}</>;
        },
    },
    {
        accessorKey: "city",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ort
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <>{row.original.city ?? ""}</>;
        },
    },
    {
        accessorKey: "zip_code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    PLZ
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <>{row.original.zip_code ?? ""}</>;
        },
    },
    {
        accessorKey: "street",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Straße
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <>{row.original.street ?? ""}</>;
        },
    },
    {
        accessorKey: "groups",
        header: () => <p className="font-medium">Gruppen</p>,
        cell: ({ row }) => {
            const groups = row.original.groups;
            return (
                <div>
                    {groups &&
                        groups.map((group) => (
                            <p key={group.id}>
                                <span className="font-medium">{group.category?.name}: </span>
                                {group.name}
                            </p>
                        ))}
                </div>
            );
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
                    await deleteCaseById(row.original.id);
                    await useCoreStore.getState().updateCasesWithRelationships();
                } catch (error) {
                    toast({
                        title: "Fall konnte nicht gelöscht werden.",
                        duration: 10000,
                        variant: "destructive",
                    });
                }
            };
            const toggleSequenceIdModal = async () => {
                try {
                    await useDataManagementStore.getState().initSequenceMappingDialog(row.original);
                } catch (error) {
                    toast({
                        title: "Fall konnte nicht gelöscht werden.",
                        duration: 10000,
                        variant: "destructive",
                    });
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
                        <DropdownMenuItem className="cursor-pointer" onClick={toggleSequenceIdModal}>
                            Sequenz ID zuweisen
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-500" onClick={deleteCase}>
                            Entfernen
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
