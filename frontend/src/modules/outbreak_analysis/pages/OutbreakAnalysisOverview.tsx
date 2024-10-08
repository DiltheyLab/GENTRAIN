import { Layout } from "@/modules/core/components/layout/Layout";
import { useGetOutbreakAnalysesForActivePathogen } from "@/modules/core/hooks/database/outbreakAnalyses/useGetOutbreakAnalysesForActivePathogen";
import { DataTable } from "@/modules/core/components/tables/DataTable";
import { customFilterFn } from "@/modules/outbreak_analysis/helpers/analysesTableFilter";
import { AnalysisCreation } from "@/modules/outbreak_analysis/components/analysis_selection/AnalysisCreation";
import { analysesTableColumns } from "@/modules/outbreak_analysis/components/analysis_selection/table/analysesTableColumns";

export const OutbreakAnalysisOverview = () => {
    const analyses = useGetOutbreakAnalysesForActivePathogen();

    return (
        <Layout>
            <div className="flex h-full flex-1 flex-col p-8">
                <h2 className="text-2xl font-bold tracking-tight">Übersicht der Ausbruchsanalysen</h2>
                <p className="text-muted-foreground">
                    Hier können Sie alle Ihre Ausbruchsanalyse einsehen und neue anlegen.
                </p>
                {analyses && (
                    <DataTable
                        data={analyses}
                        columns={analysesTableColumns}
                        pageSize={10}
                        filterFn={customFilterFn}
                        actions={() => {
                            return <AnalysisCreation />;
                        }}
                        className="mt-8"
                    />
                )}
            </div>
        </Layout>
    );
};
