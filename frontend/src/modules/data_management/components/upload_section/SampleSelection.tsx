import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTable } from "../data_table/DataTable";
import { useGetSampleTableData } from "../../hooks/useGetSampleTableData";
import { SampleUpload } from "../../services/data_upload/validation/SamplesValidation";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { CheckCheck } from "lucide-react";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";

export function SampleSelection() {
    const sampleTableData = useGetSampleTableData();
    const changeSampleUpload = useDataManagementStore((state) => state.changeSampleUpload);

    const columns: ColumnDef<SampleUpload>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                        table.getRowModel().rows.forEach((row) => {
                            changeSampleUpload(row.original.fasta_id!, { upload: !!value });
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
                            changeSampleUpload(row.original.fasta_id!, { upload: !!value });
                        }}
                        aria-label="Select row"
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "fasta_id",
            header: "Sequenz",
            cell: ({ row }) => <>{row.getValue("fasta_id")}</>,
        },
        {
            accessorKey: "case_id",
            header: "Fall",
            cell: ({ row }) => <>{row.getValue("case_id")}</>,
        },
        {
            id: "select",
            header: "Zum Import ausgewählt",
            cell: ({ row }) => (
                <CheckCheck
                    onClick={() => {}}
                    className={`${row.original.upload ? "text-primary opacity-100" : "opacity-20"}`}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];

    return (
        <>
            <DialogTitle>Sequenzen hinzufügen</DialogTitle>
            <DialogDescription>
                Folgende Sequenzen wurden in der Fastadatei gefunden. Alle ausgewählte Sequenzen werden hinzugefügt.
            </DialogDescription>
            <DataTable
                data={sampleTableData}
                columns={columns}
                pageSize={5}
                onRowClick={(row: any) => {
                    changeSampleUpload(row.original.fasta_id, { upload: !row.original.upload });
                    row.toggleSelected(!row.getIsSelected());
                }}
                preselectRows
            />
        </>
    );
}
