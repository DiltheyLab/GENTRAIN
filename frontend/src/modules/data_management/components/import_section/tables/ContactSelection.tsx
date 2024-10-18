import { DataTable } from "@/modules/core/components/tables/DataTable";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";
import { DialogDescription, DialogTitle } from "@/modules/core/components/ui/Dialog";
import { useGetContactTableData } from "@/modules/data_management/hooks/useGetContactTableData";
import { contactImportFilterFn } from "@/modules/data_management/helpers/dataTable";
import { contactSelectionColumns } from "./contactSelectionColumns";

export function ContactSelection() {
    const changeContactImport = useDataManagementStore((state) => state.changeContactImport);
    const contactTableData = useGetContactTableData();
    const showInitialUpload = useDataManagementStore((state) => state.showInitialUpload);

    return (
        <>
            {!showInitialUpload && (
                <>
                    <DialogTitle>Kontakte hinzufügen</DialogTitle>
                    <DialogDescription>
                        Folgende Kontakte wurden in der CSV-Datei gefunden. Alle ausgewählte Kontakte werden
                        hinzugefügt.
                    </DialogDescription>
                </>
            )}
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
                    selectionLabel="Kontakten"
                />
            </div>
        </>
    );
}
