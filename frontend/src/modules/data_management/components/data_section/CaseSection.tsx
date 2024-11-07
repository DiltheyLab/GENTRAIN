import { DataTable } from "@/modules/core/components/tables/DataTable";
import { uploadedCaseColumns } from "./uploadedCaseColumns";
import { uploadedDataFilterFn } from "../../helpers/dataTable";
import { useCoreStore } from "@/modules/core/stores/core";

export const CaseSection = () => {
    const casesData = useCoreStore((state) => state.casesWithRelationships);
    if (!casesData) return null;

    return (
        <>
            <h3 className="font-bold tracking-tight mb-2 text-lg">Falldaten</h3>
            <DataTable
                data={casesData}
                columns={uploadedCaseColumns}
                filterFn={uploadedDataFilterFn}
                selectionLabel="Fällen"
                pageSize={5}
            />
        </>
    );
};
