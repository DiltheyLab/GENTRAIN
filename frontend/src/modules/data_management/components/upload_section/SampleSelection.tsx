import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";
import { Button } from "@/modules/core/components/ui/Button";
import { DataTable } from "../data_table/DataTable";
import { useGetSampleTableData } from "../../hooks/useGetSampleTableData";
import { SampleUpload } from "../../services/data_upload/validation/SamplesValidation";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/core/components/ui/Dialog";

export function SampleSelection() {
    const sampleTableData = useGetSampleTableData();
    const sampleUploads = useDataManagementStore((state) => state.sampleUploads);
    const removeSampleUpload = useDataManagementStore((state) => state.removeSampleUpload);
    const changeSampleUpload = useDataManagementStore((state) => state.changeSampleUpload);

    const columns: ColumnDef<SampleUpload>[] = [
        {
            id: "select",
            cell: ({ row }) => {
                if (sampleUploads[row.original.fasta_id!].status === "sent") {
                    row.toggleSelected(true);
                }
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={() => {
                            if (row.getIsSelected()) {
                                changeSampleUpload(row.original.fasta_id!, { status: "removed" });
                                row.toggleSelected(false);
                            } else {
                                changeSampleUpload(row.original.fasta_id!, { status: "sent" });
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
            accessorKey: "fasta_id",
            header: "Sequenz",
            cell: ({ row }) => <>{row.getValue("fasta_id")}</>,
        },
        {
            accessorKey: "case_id",
            header: "Fall",
            cell: ({ row }) => <>{row.getValue("case_id")}</>,
        },
    ];

    return (
        <>
            <DialogTitle>Sequenzen hinzufügen</DialogTitle>
            <DialogDescription>
                Folgende Sequenzen wurden in der Fastadatei gefunden. Alle ausgewählte Sequenzen werden hinzugefügt.
            </DialogDescription>
            <DataTable data={sampleTableData} columns={columns} />
        </>
    );
}
