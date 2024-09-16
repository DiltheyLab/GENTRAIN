import { DashboardSettings } from "@/modules/dashboard/components/graph/Settings";
import { DashboardVisualizationPanel } from "@/modules/dashboard/components/graph/VisualizationPanel";
import { Layout } from "@/modules/core/components/layout/Layout";
import { InformationTables } from "../components/information_table/InformationTables";
import { useCoreStore } from "@/modules/core/stores/core";
import { useEffect } from "react";
import { useDashboardStore } from "../stores/dashboard";

export function Dashboard() {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const updateSettings = useDashboardStore((state) => state.updateSettings);

    useEffect(() => {
        if (!activePathogen) return;
        updateSettings({
            clusteringThreshold: activePathogen?.genetic_distance_threshold ?? 0,
            geneticDistanceThreshold: activePathogen?.genetic_distance_threshold ?? 0,
        });
    }, [activePathogen]);

    return (
        <Layout>
            <div className="relative mx-auto p-4">
                <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <DashboardSettings />
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
