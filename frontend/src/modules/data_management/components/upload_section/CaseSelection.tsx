import { ColumnDef } from "@tanstack/react-table";
import { useGetCaseTableData } from "../../hooks/useGetCaseTableData";
import { DataTable } from "../data_table/DataTable";
import { CaseUpload } from "../../services/data_upload/validation/CasesValidation";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown } from "lucide-react";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { formatDate } from "@/modules/core/helpers/dates";
import { useDataManagementStore } from "../../stores/dataManagement";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
export function CaseSelection() {
    const caseTableData = useGetCaseTableData();
    const changeCaseUpload = useDataManagementStore((state) => state.changeCaseUpload);
    const columns: ColumnDef<CaseUpload>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        table.getRowModel().rows.forEach((row) => {
                            changeCaseUpload(row.original.case_id!, { upload: !!value });
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
                            changeCaseUpload(row.original.case_id!, { upload: !!value });
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
            cell: ({ row }) => <>{row.getValue("case_id")}</>,
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
            cell: ({ row }) => <>{row.getValue("fasta_id")}</>,
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
            cell: ({ row }) => <>{row.getValue("outbreak")}</>,
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
            cell: ({ row }) => <>{formatDate(row.getValue("registered_at"))}</>,
        },
    ];

    return (
        <>
            <DialogTitle>Es wurden neue Fälle hochgeladen. Möchten Sie diese hinzufügen?</DialogTitle>
            <DialogDescription>
                Folgende Fälle wurden in der CSV-Datei und im bestehenden Datenbestand gefunden. Alle ausgewählte Fälle
                werden aktualisiert.
            </DialogDescription>
            {caseTableData && (
                <DataTable
                    data={caseTableData}
                    columns={columns}
                    pageSize={5}
                    onRowClick={(row: any) => {
                        if (!row.original.case_id) return;
                        changeCaseUpload(row.original.case_id!, { upload: !row.getIsSelected() });
                        row.toggleSelected(!row.getIsSelected());
                    }}
                    preselectRows
                />
            )}
        </>
    );
}
