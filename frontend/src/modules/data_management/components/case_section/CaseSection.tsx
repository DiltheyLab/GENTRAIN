import { DataTable } from "@/modules/core/components/tables/DataTable";
import { uploadedDataFilterFn } from "../../helpers/dataTable";
import { useCoreStore } from "@/modules/core/stores/core";
import { caseTableColumns } from "./caseTableColumns";
import { SequenceMappingDialog } from "./SequenceMappingDialog";
import { useDataManagementStore } from "../../stores/dataManagement";
import { Button } from "@/modules/core/components/ui/Button";
import { Row } from "@tanstack/react-table";
import { CaseWithRelationships, deleteCaseById } from "@/modules/core/models/cases";

export const CaseSection = () => {
    const casesData = useCoreStore((state) => state.casesWithRelationships);
    const updateCasesWithRelationships = useCoreStore((state) => state.updateCasesWithRelationships);
    const sequenceMappingDialogCase = useDataManagementStore((state) => state.sequenceMappingDialogCase);

    if (!casesData) return null;

    const deleteSelectedCases = (selectedRows: Row<CaseWithRelationships>[]) => {
        selectedRows.forEach(async (row, index) => {
            const currentCase = row.original;
            await deleteCaseById(currentCase.id);
            if (index === selectedRows.length - 1) {
                updateCasesWithRelationships();
            }
        });
    };

    return (
        <>
            <h3 className="font-bold tracking-tight mb-2 text-lg">Falldaten</h3>
            <DataTable
                actions={(table) => {
                    return (
                        <>
                            {table.getSelectedRowModel().rows.length > 0 && (
                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                        deleteSelectedCases(table.getSelectedRowModel().rows);
                                        table.resetRowSelection();
                                    }}
                                >
                                    Ausgewählte Fälle löschen
                                </Button>
                            )}
                        </>
                    );
                }}
                data={casesData}
                columns={caseTableColumns}
                filterFn={uploadedDataFilterFn}
                selectionLabel="Fällen"
                pageSize={5}
            />
            {sequenceMappingDialogCase && <SequenceMappingDialog />}
        </>
    );
};
