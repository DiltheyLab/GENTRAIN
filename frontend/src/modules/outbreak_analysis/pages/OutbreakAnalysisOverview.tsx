import { useGetOutbreakAnalysesForActivePathogen } from "@/modules/core/hooks/database/outbreakAnalyses/useGetOutbreakAnalysesForActivePathogen";
import { DataTable } from "@/modules/core/components/tables/DataTable";
import { analysesTableFilter } from "@/modules/outbreak_analysis/helpers/analysesTableFilter";
import { AnalysisCreation } from "@/modules/outbreak_analysis/components/analysis_selection/AnalysisCreation";
import { analysesTableColumns } from "@/modules/outbreak_analysis/components/analysis_selection/tables/analysesTableColumns";
import { AnalysisSchema } from "@/modules/core/models/analyses";
import { Row } from "@tanstack/react-table";
import { SelectedAnalysesDeleteDialog } from "../components/analysis_selection/tables/SelectedAnalysesDeleteAlertDialog";

export const OutbreakAnalysisOverview = () => {
    const analyses = useGetOutbreakAnalysesForActivePathogen();

    return (
        <div className="p-5">
            <div className="p-3 rounded-lg bg-white" data-tutorial-tour-step="outbreak-analysis-overview">
                <h2 className="text-2xl font-bold tracking-tight">Übersicht der Ausbruchsanalysen</h2>
                <p className="text-muted-foreground">
                    Hier können Sie alle Ihre Ausbruchsanalyse einsehen und neue anlegen.
                </p>
                <DataTable
                    data={analyses ?? []}
                    columns={analysesTableColumns}
                    pageSize={10}
                    filterFn={analysesTableFilter}
                    actions={(table) => {
                        const selectedAnalyses: Row<AnalysisSchema>[] = table.getSelectedRowModel().flatRows;

                        return (
                            <>
                                <AnalysisCreation />
                                <SelectedAnalysesDeleteDialog
                                    selectedAnalyses={selectedAnalyses}
                                    disabled={selectedAnalyses.length === 0}
                                />
                            </>
                        );
                    }}
                    selectionLabel="Analysen"
                    className="mt-8"
                    filterPlaceholder="Analyse suchen..."
                />
            </div>
        </div>
    );
};
