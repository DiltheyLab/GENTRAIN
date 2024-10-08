import { Layout } from "@/modules/core/components/layout/Layout";
import { AnalysesTable } from "../components/analysis_selection/table/AnalysesTable";
import { useGetOutbreakAnalysesForActivePathogen } from "@/modules/core/hooks/database/outbreakAnalyses/useGetOutbreakAnalysesForActivePathogen";

export const OutbreakAnalysisOverview = () => {
    const analyses = useGetOutbreakAnalysesForActivePathogen();

    return (
        <Layout>
            <div className="flex h-full flex-1 flex-col p-8">
                <h2 className="text-2xl font-bold tracking-tight">Übersicht der Ausbruchsanalysen</h2>
                <p className="text-muted-foreground">
                    Hier können Sie alle Ihre Ausbruchsanalyse einsehen und neue anlegen.
                </p>
                {analyses && <AnalysesTable data={analyses} />}
            </div>
        </Layout>
    );
};
