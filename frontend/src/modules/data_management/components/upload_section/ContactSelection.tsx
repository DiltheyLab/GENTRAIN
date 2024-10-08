import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data_table/DataTable";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown } from "lucide-react";
import { useDataManagementStore } from "../../stores/dataManagement";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { useGetContactTableData } from "../../hooks/useGetContactTableData";
import { ContactUpload } from "../../services/data_upload/validation/ContactsValidation";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { contactUploadFilterFn } from "../../helpers/dataTable";

export function ContactSelection() {
    const changeContactUpload = useDataManagementStore((state) => state.changeContactUpload);
    const contactTableData = useGetContactTableData();
    const columns: ColumnDef<ContactUpload>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        table.getRowModel().rows.forEach((row) => {
                            changeContactUpload(row.original.contact_id!, { upload: !!value });
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
                            changeContactUpload(row.original.contact_id!, { upload: !!value });
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
                        Fall 2
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
            <DataTable
                data={contactTableData}
                columns={columns}
                pageSize={5}
                filterFn={contactUploadFilterFn}
                onRowClick={(row: any) => {
                    if (!row.original.contact_id) return;
                    changeContactUpload(row.original.contact_id, { upload: !row.original.upload });
                    row.toggleSelected(!row.getIsSelected());
                }}
                preselectRows
            />
        </>
    );
}
