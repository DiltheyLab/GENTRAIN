import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data_table/DataTable";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown } from "lucide-react";
import { useDataManagementStore } from "../../stores/dataManagement";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { useGetContactTableData } from "../../hooks/useGetContactTableData";
import { ContactUpload } from "../../services/data_upload/validation/ContactsValidation";

export function ContactSelection() {
    const contactUploads = useDataManagementStore((state) => state.contactUploads);
    const changeContactUpload = useDataManagementStore((state) => state.changeContactUpload);
    const contactTableData = useGetContactTableData();
    const columns: ColumnDef<ContactUpload>[] = [
        {
            id: "select",
            cell: ({ row }) => {
                if (contactUploads[row.original.contact_id!].status === "selected") {
                    row.toggleSelected(true);
                }
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={() => {
                            if (row.getIsSelected()) {
                                changeContactUpload(row.original.contact_id!, { status: "removed" });
                                row.toggleSelected(false);
                            } else {
                                changeContactUpload(row.original.contact_id!, { status: "selected" });
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
            accessorKey: "case_id_1",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fall 1
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <>{row.getValue("case_id_1")}</>,
        },
        {
            accessorKey: "case_id_2",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Fall 1
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <>{row.getValue("case_id_2")}</>,
        },
        {
            accessorKey: "type",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Typ
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <>{row.getValue("type")}</>,
        },
        {
            accessorKey: "context",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Kontext
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <>{row.getValue("context")}</>,
        },
    ];

    return (
        <>
            <DialogTitle>Kontakte hinzufügen</DialogTitle>
            <DialogDescription>
                Folgende Kontakte wurden in der CSV-Datei gefunden. Alle ausgewählte Kontakte werden hinzugefügt.
            </DialogDescription>
            <DataTable data={contactTableData} columns={columns} pageSize={5} />
        </>
    );
}
