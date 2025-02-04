import { DataTable } from "@/modules/core/components/tables/DataTable";
import { uploadedDataFilterFn } from "../../helpers/dataTable";
import { useCoreStore } from "@/modules/core/stores/core";
import { caseTableColumns } from "./caseTableColumns";
import { SequenceMappingDialog } from "./SequenceMappingDialog";
import { useDataManagementStore } from "../../stores/dataManagement";

export const CaseSection = () => {
    const casesData = useCoreStore((state) => state.casesWithRelationships);
    const sequenceMappingDialogCase = useDataManagementStore((state) => state.sequenceMappingDialogCase);
    if (!casesData) return null;

    return (
        <>
            <h3 className="font-bold tracking-tight mb-2 text-lg">Falldaten</h3>
            <DataTable
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
