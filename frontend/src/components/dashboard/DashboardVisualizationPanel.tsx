import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useMemo, useRef } from "react";
import { deepCopyData } from "@/lib/utils";
import { createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { Legend } from "../outbreakAnalysis/Legend";
import { Loader2 } from "lucide-react";
import { GraphData } from "@/types/graph";
import { Graph3D } from "../graphs/Graph3D";
import { Graph2D } from "../graphs/Graph2D";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { CaseWithRelationships } from "@/database/cases";
import { AnalysisSettings } from "@/stores/analysis";
import { useDashboardGraphStore } from "@/stores/dashboardGraph";

export const DashboardVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const dashboardGraphStore = useDashboardGraphStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const cases = useGetAllCasesForActivePathogenWithRelationships();

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases) {
            dashboardGraphStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        const getGraphData = async (
            distanceMatrixAssembly: DistanceMatrixAssembly,
            cases: CaseWithRelationships[],
            settings: AnalysisSettings
        ) => {
            const graphData = await createGraphData(distanceMatrixAssembly, cases, settings);
            dashboardGraphStore.updateGraphData(graphData);
        };

        getGraphData(distanceMatrixAssembly, cases, dashboardGraphStore.settings);
    }, [cases, distanceMatrixAssembly, dashboardGraphStore.settings]);

    // Creating deep copy of the graph data for each graph component and
    // use useMemo hook to safe the graphData with updated simulation data to prevent to start simulation
    // from beginning after every rerendering
    const graphDataCopy = useMemo(() => {
        return deepCopyData(dashboardGraphStore.graphData);
    }, [dashboardGraphStore.graphData]);

    const renderGraph = () => {
        if (dashboardGraphStore.graphData.nodes.length === 0 && !cases) {
            return <Loader2 className="h-24 w-h-24 animate-spin" />;
        } else if (dashboardGraphStore.graphData.nodes.length === 0 && cases && cases.length === 0) {
            return <div className="flex justify-center items-center h-full w-full">Keine Daten vorhanden</div>;
        }

        const { graphDimension, charge, hideNodeLabel, linkDistance, linkWidth, nodeSize, zoomToFit } =
            dashboardGraphStore.graphSettings;
        if (graphDimension === "2D" && width && height) {
            return (
                <Graph2D
                    data={graphDataCopy as GraphData}
                    width={width - 8}
                    height={height - 8}
                    charge={charge}
                    linkDistance={linkDistance}
                    nodeSize={nodeSize}
                    hideNodeLabel={hideNodeLabel}
                    linkWidth={linkWidth}
                    zoomToFit={zoomToFit}
                />
            );
        } else if (dashboardGraphStore.graphSettings.graphDimension === "3D" && width && height) {
            return (
                <Graph3D
                    data={graphDataCopy as GraphData}
                    width={width - 8}
                    height={height - 8}
                    charge={charge}
                    linkDistance={linkDistance}
                    nodeSize={nodeSize}
                    linkWidth={linkWidth}
                    zoomToFit={zoomToFit}
                />
            );
        }
    };

    return (
        <div ref={containerRef} className="relative flex h-full flex-col rounded-xl bg-muted lg:col-span-2">
            <Badge variant="outline" className="absolute z-20 right-3 top-3 bg-muted">
                {dashboardGraphStore.graphSettings.graphDimension}
            </Badge>
            <Button variant="outline" className="absolute z-20 bottom-3 right-3">
                Reset
            </Button>
            <Legend nodes={dashboardGraphStore.graphData.nodes} />

            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                {renderGraph()}
            </div>
        </div>
    );
};
