import { ColumnDef } from "@tanstack/react-table";
import { useGetCaseTableData } from "../../hooks/useGetCaseTableData";
import { DataTable } from "../data_table/DataTable";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { CaseUpload } from "../../services/data_upload/validation/CasesValidation";
import { useGetAlreadyExistingCasesTableData } from "../../hooks/useGetAlreadyExistingCasesTableData";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/modules/core/components/ui/Dropdown-menu";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useDataManagementStore } from "../../stores/dataManagement";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";

export function CaseSelection() {
    const caseUploads = useDataManagementStore((state) => state.caseUploads);
    const changeCaseUpload = useDataManagementStore((state) => state.changeCaseUpload);
    const removeCaseUpload = useDataManagementStore((state) => state.removeCaseUpload);
    const alreadyExistingCasesTableData = useGetAlreadyExistingCasesTableData();
    const caseTableData = useGetCaseTableData();
    const columns: ColumnDef<CaseUpload>[] = [
        {
            id: "select",
            cell: ({ row }) => {
                if (caseUploads[row.original.case_id!].status === "selected") {
                    row.toggleSelected(true);
                }
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={() => {
                            if (row.getIsSelected()) {
                                changeCaseUpload(row.original.case_id!, { status: "removed" });
                                row.toggleSelected(false);
                            } else {
                                changeCaseUpload(row.original.case_id!, { status: "selected" });
                                row.toggleSelected(true);
                            }
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
            cell: ({ row }) => <>{row.getValue("registered_at")}</>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const deleteCase = async () => {
                    removeCaseUpload(row.getValue("case_id"));
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
                            <DropdownMenuItem className="cursor-pointer" onClick={deleteCase}>
                                Entfernen
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <>
            <DialogTitle>Fälle hinzufügen</DialogTitle>
            <DialogDescription>
                Folgende Fälle wurden in der CSV-Datei gefunden. Alle ausgewählte Fälle werden hinzugefügt.
            </DialogDescription>
            {alreadyExistingCasesTableData && <DataTable data={alreadyExistingCasesTableData} columns={columns} />}
            <DataTable data={caseTableData} columns={columns} />
        </>
    );
}
