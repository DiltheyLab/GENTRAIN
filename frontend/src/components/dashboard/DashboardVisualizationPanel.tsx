import { createGraphData, createColorMapForNodes } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { Legend } from "../layout/Legend";
import { Graph2D } from "../graphs/Graph2D";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { CaseWithRelationships } from "@/database/cases";
import { AnalysisSettings } from "@/stores/analysis";
import { useDashboardGraphStore } from "@/stores/dashboardGraph";
import { useGetAllContacts } from "@/hooks/database/contacts/useGetAllContacts";
import { ContactSchema } from "@/database/contacts";
import { useEffect, useRef } from "react";

export const DashboardVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const dashboardGraphStore = useDashboardGraphStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const contacts = useGetAllContacts();
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const { charge, showNodeLabel, linkDistance, linkWidth, nodeSize } = dashboardGraphStore.graphSettings;

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases || !contacts) {
            dashboardGraphStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        const getGraphData = async (
            distanceMatrixAssembly: DistanceMatrixAssembly,
            cases: CaseWithRelationships[],
            settings: AnalysisSettings,
            contacts: ContactSchema[]
        ) => {
            const graphData = await createGraphData(distanceMatrixAssembly, cases, settings, contacts);
            dashboardGraphStore.updateGraphData(graphData);
            const colorMap = createColorMapForNodes(cases, null);
            dashboardGraphStore.updateGraphSettings({ colorMap });
        };

        getGraphData(distanceMatrixAssembly, cases, dashboardGraphStore.settings, contacts);
    }, [cases, distanceMatrixAssembly, contacts]);

    return (
        <div ref={containerRef} className="relative flex h-full flex-col rounded-xl bg-muted lg:col-span-2">
            <Legend
                nodes={dashboardGraphStore.graphData.nodes}
                links={dashboardGraphStore.graphData.links}
                colorMap={dashboardGraphStore.graphSettings.colorMap}
                variant={dashboardGraphStore.graphSettings.isColoredByTimeSpan ? "timeSpan" : "dashboard"}
            />
            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                <Graph2D
                    data={dashboardGraphStore.graphData}
                    width={width - 8}
                    height={height - 8}
                    colorMap={dashboardGraphStore.graphSettings.colorMap}
                    isColoredByTimeSpan={dashboardGraphStore.graphSettings.isColoredByTimeSpan}
                    cases={cases}
                    charge={charge}
                    linkDistance={linkDistance}
                    nodeSize={nodeSize}
                    showNodeLabel={showNodeLabel}
                    linkWidth={linkWidth}
                    initialCenter={true}
                />
            </div>
        </div>
    );
};
