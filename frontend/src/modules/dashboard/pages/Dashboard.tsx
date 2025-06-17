import { DashboardSettings } from "@/modules/dashboard/components/graph/Settings";
import { DashboardVisualizationPanel } from "@/modules/dashboard/components/graph/VisualizationPanel";
import { InformationTables } from "../components/information_table/InformationTables";
import { useUpdateClusterAndGeneticDistanceThresholds } from "../hooks/useUpdateClusterAndGeneticDistanceThresholds";
import { Charts } from "../components/charts/Charts";
import { Button } from "@/modules/core/components/ui/Button";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { useCoreStore } from "@/modules/core/stores/core";

export function Dashboard() {
    useUpdateClusterAndGeneticDistanceThresholds();
    const runDistanceCalculation = async () => {
        const distanceCalculationStrategy = await PathogenStrategyManager.getDistanceCalculationStrategy(
            useCoreStore.getState().activePathogen!
        );
        if (!distanceCalculationStrategy) return;
        await distanceCalculationStrategy.execute();
    };
    return (
        <div className="relative mx-auto p-4" data-tutorial-tour-step="tutorial-start">
            <div className="flex flex-col-reverse gap-4 md:flex-row min-h-[85vh]">
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
                    <Button onClick={runDistanceCalculation}>Distance Calculation</Button>
                    <DashboardSettings />
                    <Charts />
                </div>
                <div className="w-full md:w-2/3 lg:w-3/4">
                    <DashboardVisualizationPanel />
                </div>
            </div>
            <InformationTables />
        </div>
    );
}
