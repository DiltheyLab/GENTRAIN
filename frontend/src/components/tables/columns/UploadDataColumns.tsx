import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaseWithRelationships } from "@/database/cases";
import { deleteCasebyIdAndRecalculateDistances } from "@/services/cases";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const UploadDataColumns: ColumnDef<CaseWithRelationships>[] = [
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
                    Fall Id
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="capitalize">{row.original.case_id}</div>,
    },
    {
        accessorKey: "outbreak",
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
            return <div>{outbreak ? outbreak.name : "-"}</div>;
        },
    },
    {
        accessorKey: "groups",
        header: () => <div>Gruppen</div>,
        cell: ({ row }) => {
            const groups = row.original.groups;
            return (
                <div>
                    {groups &&
                        groups.map((group) => (
                            <div key={group.name}>
                                <small>
                                    <b>{group.category?.name}: </b>
                                    {group.name}
                                </small>
                            </div>
                        ))}
                </div>
            );
        },
    },
    {
        accessorKey: "sequence",
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
            const sample = row.original.sample;
            if (sample) {
                return (
                    <>
                        <div>
                            <small>
                                <b>{sample.fasta_id}</b>
                            </small>
                        </div>
                        <div>
                            <small>{sample.lineage}</small>
                        </div>
                        <div>
                            <small>{sample.n_count} Ambigious Characters</small>
                        </div>
                    </>
                );
            }

            return <div>{row.original.sample_id ?? ""}</div>;
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
            return <div className="capitalize">{row.original.registered_at.toLocaleDateString()}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => deleteCasebyIdAndRecalculateDistances(row.original.id)}
                        >
                            Entfernen
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
