import { Button } from "@/modules/core/components/ui/Button";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { formatDate } from "@/modules/core/helpers/dates";
import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const caseSelectionColumns: ColumnDef<CaseImport & { existingCase: CaseWithRelationships }>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value);
                    table.getRowModel().rows.forEach((row) => {
                        useDataManagementStore.getState().changeCaseImport(row.original.case_id!, { import: !!value });
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
                        useDataManagementStore.getState().changeCaseImport(row.original.case_id!, { import: !!value });
                    }}
                    aria-label="Select row"
                />
            );
        },
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
        cell: ({ row }) => row.getValue("case_id"),
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
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.fasta_id !== row.original.fasta_id && (
                    <div className="line-through">{row.original.existingCase.fasta_id}</div>
                )}
                <div>{row.original.fasta_id}</div>
            </>
        ),
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
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.outbreak?.name !== row.original.outbreak && (
                    <div className="line-through">{row.original.existingCase.outbreak?.name}</div>
                )}
                <div>{row.original.outbreak}</div>
            </>
        ),
    },
    {
        accessorKey: "registered_at",
        header: "Registrierungsdatum",
        cell: ({ row }) => (
            <>
                {row.original.existingCase &&
                    formatDate(row.original.existingCase.registered_at) !== formatDate(row.original.registered_at) && (
                        <div className="line-through">{formatDate(row.original.existingCase.registered_at)}</div>
                    )}
                <div>{formatDate(row.original.registered_at)}</div>
            </>
        ),
    },
    {
        accessorKey: "infected_by",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Angesteckt bei
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.infected_by !== row.original.infected_by && (
                    <div className="line-through">{row.original.existingCase.infected_by}</div>
                )}
                <div>{row.original.infected_by}</div>
            </>
        ),
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
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.last_name !== row.original.last_name && (
                    <div className="line-through">{row.original.existingCase.last_name}</div>
                )}
                <div>{row.original.last_name}</div>
            </>
        ),
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
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.first_name !== row.original.first_name && (
                    <div className="line-through">{row.original.existingCase.first_name}</div>
                )}
                <div>{row.original.first_name}</div>
            </>
        ),
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
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.city !== row.original.city && (
                    <div className="line-through">{row.original.existingCase.city}</div>
                )}
                <div>{row.original.city}</div>
            </>
        ),
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
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.zip_code !== row.original.zip_code && (
                    <div className="line-through">{row.original.existingCase.zip_code}</div>
                )}
                <div>{row.original.zip_code}</div>
            </>
        ),
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
        cell: ({ row }) => (
            <>
                {row.original.existingCase && row.original.existingCase.street !== `${row.original.street} ${row.original.street_number ?? ""}`.trim() && (
                    <div className="line-through">{row.original.existingCase.street}</div>
                )}
                <div>{`${row.original.street} ${row.original.street_number ?? ""}`.trim()}</div>
            </>
        ),
    },
    {
        accessorKey: "groups",
        header: "Gruppen",
        cell: ({ row }) => {
            const updatedGroups = row.original.groups;
            const removedGroups =
                row.original.existingCase?.groups
                    ?.filter(
                        (existingGroup) =>
                            updatedGroups.some(
                                (group) => existingGroup.category?.name === group.category && !group.remaining
                            ) || !updatedGroups.some((group) => existingGroup.category?.name === group.category)
                    )
                    .map((group) => {
                        return { category: group.category?.name, name: group.name, type: "remove" };
                    }) ?? [];
            const groups = [];
            for (const group of removedGroups) {
                groups.push({ category: group.category, name: group.name, type: "remove" });
            }
            for (const group of updatedGroups) {
                groups.push({ category: group.category, name: group.name, type: "add" });
            }

            groups.sort((a: any, b: any) => {
                const categoryA = a.category.toUpperCase();
                const categoryB = b.category.toUpperCase();
                if (categoryA < categoryB) {
                    return -1;
                }
                if (categoryA > categoryB) {
                    return 1;
                }
                return 0;
            });
            return (
                <>
                    {groups &&
                        groups.map((group) => (
                            <div key={`updated_${row.original.case_id}_${group.category}_${group.name}`}>
                                <p className={`block ${group.type === "remove" ? "line-through" : ""}`}>
                                    <b>{group.category}:</b> {group.name}
                                </p>
                            </div>
                        ))}
                </>
            );
        },
    },
];
