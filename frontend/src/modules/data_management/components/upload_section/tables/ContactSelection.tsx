import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Button } from "@/modules/core/components/ui/Button";
import { ArrowUpDown } from "lucide-react";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { useGetContactTableData } from "@/modules/data_management/hooks/useGetContactTableData";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { ContactImport } from "@/modules/core/models/contacts";
import { contactImportFilterFn } from "@/modules/data_management/helpers/dataTable";

export function ContactSelection() {
    const changeContactImport = useDataManagementStore((state) => state.changeContactImport);
    const contactTableData = useGetContactTableData();
    const contactSelectionColumns: ColumnDef<ContactImport>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        table.getRowModel().rows.forEach((row) => {
                            changeContactImport(row.original.contact_id!, { upload: !!value });
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
                            changeContactImport(row.original.contact_id!, { upload: !!value });
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
            <div className="p-2">
                <DataTable
                    data={contactTableData}
                    columns={contactSelectionColumns}
                    pageSize={5}
                    filterFn={contactImportFilterFn}
                    onRowClick={(row: any) => {
                        if (!row.original.contact_id) return;
                        changeContactImport(row.original.contact_id, { upload: !row.original.upload });
                        row.toggleSelected(!row.getIsSelected());
                    }}
                    preselectRows
                />
            </div>
        </>
    );
}
