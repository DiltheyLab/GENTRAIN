import { createGraphData, createColorMapForNodes, findClustersOfNodes } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { Legend } from "../graphs/panelLayout/Legend";
import { Graph2D } from "../graphs/Graph2D";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { CaseWithRelationships } from "@/database/cases";
import { AnalysisSettings } from "@/stores/analysis";
import { useDashboardStore } from "@/stores/dashboard";
import { useGetAllContacts } from "@/hooks/database/contacts/useGetAllContacts";
import { ContactSchema } from "@/database/contacts";
import { useEffect, useRef, useState } from "react";
import { CaseInfo } from "../graphs/panelLayout/CaseInfo";
import { useCreateColorMapForTimeSpan } from "@/hooks/useCreateColorMapForTimeSpan";

export const DashboardVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const dashboardStore = useDashboardStore();

    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const contacts = useGetAllContacts();
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const [selectedCase, setSelectedCase] = useState<CaseWithRelationships | null>(null);
    const { charge, showNodeLabel, linkDistance, linkWidth, nodeSize } = dashboardStore.graphSettings;
    useCreateColorMapForTimeSpan(
        dashboardStore.graphData.nodes,
        dashboardStore.graphSettings,
        dashboardStore.updateGraphSettings
    );

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases || !contacts) {
            dashboardStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        const getGraphData = async (
            distanceMatrixAssembly: DistanceMatrixAssembly,
            cases: CaseWithRelationships[],
            settings: AnalysisSettings,
            contacts: ContactSchema[]
        ) => {
            let graphData = await createGraphData(distanceMatrixAssembly, cases, settings, contacts);
            if (
                dashboardStore.graphSettings.coloringMode === "clusters" &&
                dashboardStore.settings.clusteringThreshold
            ) {
                const { nodes } = findClustersOfNodes(graphData, dashboardStore.settings.clusteringThreshold);
                graphData = { nodes, links: graphData.links };
            }
            dashboardStore.updateGraphData(graphData);
            const colorMap = createColorMapForNodes(undefined, undefined, graphData.nodes);
            dashboardStore.updateGraphSettings({ colorMap });
        };

        getGraphData(distanceMatrixAssembly, cases, dashboardStore.settings, contacts);
    }, [cases, distanceMatrixAssembly, contacts, dashboardStore.settings, dashboardStore.graphSettings.coloringMode]);

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col justify-center items-center h-[85vh] rounded-xl bg-muted lg:col-span-2"
        >
            <Legend
                nodes={dashboardStore.graphData.nodes}
                links={dashboardStore.graphData.links}
                colorMap={dashboardStore.graphSettings.colorMap}
                variant={dashboardStore.graphSettings.coloringMode === "timeSpan" ? "timeSpan" : "dashboard"}
            />
            <CaseInfo
                selectedCase={selectedCase}
                updateSelectedCase={(selectedCase) => setSelectedCase(selectedCase)}
            />
            <Graph2D
                data={dashboardStore.graphData}
                width={width - 8}
                height={height - 8}
                colorMap={dashboardStore.graphSettings.colorMap}
                coloringMode={dashboardStore.graphSettings.coloringMode}
                cases={cases}
                charge={charge}
                linkDistance={linkDistance}
                nodeSize={nodeSize}
                showNodeLabel={showNodeLabel}
                linkWidth={linkWidth}
                initialCenter={true}
                updateSelectedCase={(selectedCase) => setSelectedCase(selectedCase)}
                selectedCase={selectedCase}
            />
        </div>
    );
};
