import { useResizeContainer } from "@/modules/core/hooks/useResizeContainer";
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
import { GraphSettings } from "@/modules/core/components/graph/GraphSettings";
import { NodeColorMapGenerator } from "@/modules/core/services/graph/NodeColorMapGenerator";
import { useGetDistanceMatrixAssembly } from "@/modules/core/hooks/database/distance_matrices/useGetDistanceMatrixAssembly";
import { CustomNode } from "@/modules/core/types/graph";
import { useLinksBelowGeneticDistanceThreshold } from "@/modules/core/hooks/graph/useLinksBelowGeneticDistanceThreshold";

export const DashboardVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const dashboardStore = useDashboardStore();
    const { charge, showNodeLabel, linkDistance, linkWidth, nodeSize, colorMap, coloringMode } =
        dashboardStore.graphSettings;
    const [showGraphSettings, setShowGraphSettings] = useState(false);
    const distanceMatrixAssembly = useGetDistanceMatrixAssembly();
    const contacts = useGetAllContacts();
    const cases = useCoreStore((state) => state.casesWithRelationships);
    const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
    const activePathogenId = useCoreStore((state) => state.activePathogen?.id);
    const geneticDistanceThreshold = useCoreStore((state) => state.activePathogen?.genetic_distance_threshold);
    const [linksBelowGeneticDistanceThreshold, setAllLinks] = useLinksBelowGeneticDistanceThreshold(
        geneticDistanceThreshold ?? 0,
        selectedNode
    );

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

        // if the pathogen changes, the graph will be updated by the useEffect because the useGetDistanceMatrixAssembly and the cases changed
        // this leads to the scenario that the graph is being updated twice
        // to prevent this, we check if the pathogen_id of the first case is the same as the activePathogenId
        if (cases?.[0]?.pathogen_id !== activePathogenId) return;

        const createGraphData = async (
            distanceMatrixAssembly: DistanceMatrixAssembly,
            cases: CaseWithRelationships[],
            settings: AnalysisSettings,
            contacts: ContactSchema[]
        ) => {
            const graphDataGenerator = new GraphDataGenerator(cases, distanceMatrixAssembly, contacts, settings);
            let graphData = await graphDataGenerator.execute();
            const allLinks = graphDataGenerator.getAllLinks();
            setAllLinks(allLinks);

            if (dashboardStore.graphSettings.coloringMode === "clusters") {
                // create clusters and assign them to the nodes based on all links (not only the MSTLinks) below the clustering threshold
                const clusterAnalyser = new ClusterAnalyser(graphData.nodes, allLinks, settings.clusteringThreshold);
                graphData.nodes = clusterAnalyser.assignClusterNamesToNodes();
                dashboardStore.updateClusters(clusterAnalyser.getClusters());
            }

            dashboardStore.updateGraphData(graphData);
            const colorMapGenerator = new NodeColorMapGenerator(graphData.nodes);
            const colorMap = colorMapGenerator.createColorMapForClusters();
            dashboardStore.updateGraphSettings({ colorMap });
        };

        createGraphData(distanceMatrixAssembly, cases, dashboardStore.settings, contacts);
    }, [
        cases,
        distanceMatrixAssembly,
        dashboardStore.graphSettings.coloringMode,
        dashboardStore.settings.clusteringThreshold,
        dashboardStore.settings.excludeCasesWithoutSequence,
        dashboardStore.settings.showContactTracingLinks,
        contacts,
    ]);

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col justify-center items-center h-full rounded-lg bg-muted lg:col-span-2"
        >
            <Legend
                nodes={dashboardStore.graphData.nodes}
                links={dashboardStore.graphData.links}
                linksBelowGeneticDistanceThreshold={linksBelowGeneticDistanceThreshold}
                geneticDistanceThreshold={geneticDistanceThreshold}
                colorMap={colorMap}
                variant={coloringMode === "timeSpan" ? "timeSpan" : "dashboard"}
            />
            <CaseInfo
                selectedNode={selectedNode}
                updateSelectedNode={(selectedNode) => setSelectedNode(selectedNode)}
            />
            <GraphSettings
                showGraphSettings={showGraphSettings}
                updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                graphSettings={dashboardStore.graphSettings}
                updateGraphSettings={dashboardStore.updateGraphSettings}
            />
            <Graph2D
                data={dashboardStore.graphData}
                width={width}
                height={height}
                colorMap={colorMap}
                coloringMode={coloringMode}
                cases={cases}
                charge={charge}
                linkDistance={linkDistance}
                nodeSize={nodeSize}
                showNodeLabel={showNodeLabel}
                linkWidth={linkWidth}
                initialCenter={true}
                updateSelectedNode={(selectedCase) => setSelectedNode(selectedCase)}
                selectedNode={selectedNode}
                isLoading={typeof distanceMatrixAssembly === "undefined" || !contacts || !cases}
                linksBelowGeneticDistanceThreshold={linksBelowGeneticDistanceThreshold}
            />
        </div>
    );
};
