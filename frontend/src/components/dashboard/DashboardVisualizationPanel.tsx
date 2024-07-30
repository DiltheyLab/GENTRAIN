import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useEffect, useMemo, useRef } from "react";
import { deepCopyData } from "@/lib/utils";
import { transformDistanceMatrixToGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGraphStore } from "@/stores/graph";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { Legend } from "../outbreakAnalysis/Legend";
import { Loader2 } from "lucide-react";
import { GraphData } from "@/types/graph";
import { Graph3D } from "../graphs/Graph3D";
import { Graph2D } from "../graphs/Graph2D";

export const DashboardVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const graphStore = useGraphStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const cases = useGetAllCasesWithRelationships();

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases) {
            graphStore.updateData({ nodes: [], links: [] });
            return;
        }

        const graphData = transformDistanceMatrixToGraphData(distanceMatrixAssembly, cases);

        // Update the graph settings with the new graph data
        graphStore.updateData(graphData);
    }, [cases, distanceMatrixAssembly, graphStore.settings.filter]);

    // Creating deep copy of the graph data for each graph component and
    // use useMemo hook to safe the graphData with updated simulation data to prevent to start simulation
    // from beginning after every rerendering
    const graphDataCopy = useMemo(() => {
        return deepCopyData(graphStore.data);
    }, [graphStore.data]);

    const getGraph = () => {
        const { graphDimension, charge, hideNodeLabel, linkDistance, linkWidth, nodeSize, zoomToFit } =
            graphStore.settings;
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
        } else if (graphStore.settings.graphDimension === "3D" && width && height) {
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
            <Badge variant="outline" className="absolute z-50 right-3 top-3">
                {graphStore.settings.graphDimension}
            </Badge>
            <Button variant="outline" className="absolute z-50 bottom-3 right-3">
                Reset
            </Button>
            <Legend nodes={graphStore.data.nodes} />

            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                {graphStore.data.nodes.length !== 0 ? getGraph() : <Loader2 className="h-24 w-h-24 animate-spin" />}
            </div>
        </div>
    );
};
