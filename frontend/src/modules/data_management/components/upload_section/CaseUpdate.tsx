import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data_table/DataTable";
import { CaseUpload } from "../../services/data_upload/validation/CasesValidation";
import { useGetAlreadyExistingCasesTableData } from "../../hooks/useGetAlreadyExistingCasesTableData";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown, CheckCheck } from "lucide-react";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { formatDate } from "@/modules/core/helpers/dates";
import { useDataManagementStore } from "../../stores/dataManagement";

export function CaseUpdate() {
    const changeExistingCase = useDataManagementStore((state) => state.changeExistingCase);
    const existingCasesTableData = useGetAlreadyExistingCasesTableData();

    const columns: ColumnDef<{ existingCase: CaseWithRelationships; caseUpload: CaseUpload }>[] = [
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
                    {row.original.existingCase.fasta_id !== row.original.caseUpload.fasta_id && (
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
        {
            id: "select",
            cell: ({ row }) => (
                <CheckCheck
                    onClick={() => {}}
                    className={`${row.original.caseUpload.upload ? "text-primary opacity-100" : "opacity-20"}`}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];

    return (
        <>
            <DialogTitle>Fälle aktualisieren</DialogTitle>
            <DialogDescription>
                Folgende Fälle wurden in der CSV-Datei und im bestehenden Datenbestand gefunden. Alle ausgewählte Fälle
                werden aktualisiert.
            </DialogDescription>
            {existingCasesTableData && (
                <DataTable
                    data={existingCasesTableData}
                    columns={columns}
                    pageSize={5}
                    onRowClick={(row: any) => {
                        if (!row.original.caseUpload.case_id) return;
                        const updatedCase = row.original.caseUpload;
                        updatedCase.upload = !updatedCase.upload;
                        changeExistingCase(row.original.caseUpload.case_id, {
                            caseUpload: updatedCase,
                        });
                        row.toggleSelected(!row.getIsSelected());
                    }}
                    preselectRows
                />
            )}
        </>
    );
}
