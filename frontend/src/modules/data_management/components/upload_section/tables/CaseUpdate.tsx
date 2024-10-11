import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown } from "lucide-react";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";
import { formatDate } from "@/modules/core/helpers/dates";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { useGetExistingCasesTableData } from "@/modules/data_management/hooks/useGetExistingCasesTableData";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { caseUpdateFilterFn } from "@/modules/data_management/helpers/dataTable";

export function CaseUpdate() {
    const changeExistingCase = useDataManagementStore((state) => state.changeExistingCase);
    const existingCasesTableData = useGetExistingCasesTableData();

    const changeUploadValueOfRow = (row: Row<CaseImport & { existingCase: CaseWithRelationships }>) => {
        const updatedCase = row.original;
        updatedCase.upload = !updatedCase.upload;
        changeExistingCase(row.original.case_id!, {
            caseImport: updatedCase,
        });
    };

    const caseUpdateColumns: ColumnDef<CaseImport & { existingCase: CaseWithRelationships }>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        table.getRowModel().rows.forEach((row) => {
                            changeUploadValueOfRow(row);
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
                            changeUploadValueOfRow(row);
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
            cell: ({ row }) => <>{row.original.case_id}</>,
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
                    {row.original.existingCase.fasta_id !== row.original.fasta_id && (
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
                    {row.original.existingCase.outbreak?.name !== row.original.outbreak && (
                        <div className="line-through">{row.original.existingCase.outbreak?.name}</div>
                    )}
                    <div>{row.original.outbreak}</div>
                </>
            ),
        },
        {
            accessorKey: "groups",
            header: "Gruppen",
            cell: ({ row }) => {
                const updatedGroups = row.original.groups;
                const removedGroups =
                    row.original.existingCase.groups
                        ?.filter((existingGroup) =>
                            updatedGroups.some(
                                (group) => existingGroup.category?.name === group.category && !group.remaining
                            )
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
        {
            accessorKey: "registered_at",
            header: "Registrierungsdatum",
            cell: ({ row }) => (
                <>
                    {formatDate(row.original.existingCase.registered_at) !== formatDate(row.original.registered_at) && (
                        <div className="line-through">{formatDate(row.original.existingCase.registered_at)}</div>
                    )}
                    <div>{formatDate(row.original.registered_at)}</div>
                </>
            ),
        },
    ];

    return (
        <>
            <DialogTitle>Es wurden bereits bestehende Fälle hochgeladen. Möchten Sie diese aktualisieren?</DialogTitle>
            <DialogDescription>
                Folgende Fälle wurden in der CSV-Datei und im bestehenden Datenbestand gefunden. Alle ausgewählte Fälle
                werden aktualisiert.
            </DialogDescription>
            {existingCasesTableData && (
                <DataTable
                    data={existingCasesTableData}
                    columns={caseUpdateColumns}
                    pageSize={5}
                    filterFn={caseUpdateFilterFn}
                    onRowClick={(row: any) => {
                        row.toggleSelected(!row.getIsSelected());
                        if (!row.original.case_id) return;
                        changeUploadValueOfRow(row);
                    }}
                    preselectRows
                />
            )}
        </>
    );
}
