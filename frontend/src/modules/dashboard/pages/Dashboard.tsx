import { DashboardSettings } from "@/modules/dashboard/components/graph/Settings";
import { DashboardVisualizationPanel } from "@/modules/dashboard/components/graph/VisualizationPanel";
import { Layout } from "@/modules/core/components/layout/Layout";
import { InformationTables } from "../components/information_table/InformationTables";
import { useUpdateClusterAndGeneticDistanceThresholds } from "../hooks/useUpdateClusterAndGeneticDistanceThresholds";
import { Charts } from "../components/charts/Charts";
import { TutorialPopup } from "@/modules/core/components/tutorial/TutorialPopup";
import { useCoreStore } from "@/modules/core/stores/core";

export function Dashboard() {
    useUpdateClusterAndGeneticDistanceThresholds();
    const tutorialIsActive = useCoreStore((state) => state.tutorial.tutorialIsActive);

    return (
        <Layout>
            {tutorialIsActive && <TutorialPopup />}
            <div className="relative mx-auto p-4">
                <div className="flex flex-col-reverse gap-4 md:flex-row min-h-[85vh]">
                    <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
                        <DashboardSettings />
                        <Charts />
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <DashboardVisualizationPanel />
                    </div>
                </div>
                <InformationTables />
            </div>
        </Layout>
    );
}
