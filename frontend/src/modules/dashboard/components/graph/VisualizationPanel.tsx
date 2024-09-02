import { useResizeContainer } from "@/modules/core/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/modules/core/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { Legend } from "@/modules/core/components/graph/Legend";
import { Graph2D } from "@/modules/core/components/graph/Graph2D";
import { AnalysisSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { useDashboardStore } from "@/modules/dashboard/stores/dashboard";
import { useGetAllContacts } from "@/modules/core/hooks/database/contacts/useGetAllContacts";
import { useEffect, useRef, useState } from "react";
import { CaseInfo } from "@/modules/core/components/graph/CaseInfo";
import { useCreateColorMapForTimeSpan } from "@/modules/core/hooks/graph/useCreateColorMapForTimeSpan";
import { GraphDataGenerator } from "@/modules/core/services/graph/GraphDataGenerator";
import { ClusterAnalyser } from "@/modules/core/services/graph/ClusterAnalyser";
import { useCoreStore } from "@/modules/core/stores/core";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { ContactSchema } from "@/modules/core/models/contacts";
import { DistanceMatrixAssembly } from "@/modules/core/models/distance_matrices";
import { CaseColorMapGenerator } from "@/modules/core/services/graph/CasesColorMapGenerator";

export const DashboardVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const dashboardStore = useDashboardStore();
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const contacts = useGetAllContacts();
    const cases = useCoreStore((state) => state.casesWithRelationships);
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
            const graphDataGenerator = new GraphDataGenerator(cases, distanceMatrixAssembly, contacts, settings);
            let graphData = await graphDataGenerator.execute();

            if (dashboardStore.graphSettings.coloringMode === "clusters") {
                const clusterAnalyser = new ClusterAnalyser(settings.clusteringThreshold);
                graphData = clusterAnalyser.getClusteredGraphData(graphData);
            }

            dashboardStore.updateGraphData(graphData);
            const colorMapGenerator = new CaseColorMapGenerator(cases);
            const colorMap = colorMapGenerator.createColorMapForClusters();
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
