import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "../data_table/DataTable";
import { CaseUpload } from "../../services/data_upload/validation/CasesValidation";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown } from "lucide-react";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { formatDate } from "@/modules/core/helpers/dates";
import { useDataManagementStore } from "../../stores/dataManagement";
import { useGetExistingCasesTableData } from "../../hooks/useGetExistingCasesTableData";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { caseUploadFilterFn } from "../../helpers/dataTable";

export function CaseUpdate() {
    const changeExistingCase = useDataManagementStore((state) => state.changeExistingCase);
    const existingCasesTableData = useGetExistingCasesTableData();

    const changeUploadValueOfRow = (row: Row<{ existingCase: CaseWithRelationships; caseUpload: CaseUpload }>) => {
        const updatedCase = row.original.caseUpload;
        updatedCase.upload = !updatedCase.upload;
        changeExistingCase(row.original.caseUpload.case_id!, {
            caseUpload: updatedCase,
        });
    };
    const columns: ColumnDef<{ existingCase: CaseWithRelationships; caseUpload: CaseUpload }>[] = [
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
            cell: ({ row }) => (
                <>
                    <div>{row.original.existingCase.case_id}</div>
                </>
            ),
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
                    {row.original.existingCase.fasta_id !== row.original.caseUpload.fasta_id && (
                        <div className="line-through">{row.original.existingCase.fasta_id}</div>
                    )}
                    <div>{row.original.caseUpload.fasta_id}</div>
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
                    {row.original.existingCase.outbreak?.name !== row.original.caseUpload.outbreak && (
                        <div className="line-through">{row.original.existingCase.outbreak?.name}</div>
                    )}
                    <div>{row.original.caseUpload.outbreak}</div>
                </>
            ),
        },
        {
            accessorKey: "groups",
            header: "Gruppen",
            cell: ({ row }) => {
                const groups: { name: string; category: string }[] = row.getValue("groups");
                return (
                    <>
                        {groups &&
                            groups.map((group) => (
                                <>
                                    <p className="block">
                                        <b>{group.category}:</b> {group.name}
                                    </p>
                                </>
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
                    {formatDate(row.original.existingCase.registered_at) !==
                        formatDate(row.original.caseUpload.registered_at) && (
                        <div className="line-through">{formatDate(row.original.existingCase.registered_at)}</div>
                    )}
                    <div>{formatDate(row.original.caseUpload.registered_at)}</div>
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
                    columns={columns}
                    pageSize={5}
                    filterFn={caseUploadFilterFn}
                    onRowClick={(row: any) => {
                        row.toggleSelected(!row.getIsSelected());
                        if (!row.original.caseUpload.case_id) return;
                        changeUploadValueOfRow(row);
                    }}
                    preselectRows
                />
            )}
        </>
    );
}
