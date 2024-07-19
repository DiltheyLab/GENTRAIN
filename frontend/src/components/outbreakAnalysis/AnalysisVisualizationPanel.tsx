import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ForcedDirectedGraph2D } from "../graphs/ForcedDirectedGraph";
import { useEffect, useMemo, useRef } from "react";
import { getUniqueSamplingTimes, transformDistanceMatrixToGraphData } from "@/services/graphs";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixByPathogenId";
import { useGetAllSamples } from "@/hooks/database/samples/useGetAllSamples";
import { type GraphData, useGraphStore } from "@/stores/graph";

export const AnalysisVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const graphStore = useGraphStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrix = useGetDistanceMatrixByPathogenId(activePathogen?.id);
    const samples = useGetAllSamples();

    useEffect(() => {
        if (!distanceMatrix || !samples) {
            graphStore.updateData({ nodes: [], links: [] });
            return;
        }

        const graphData = transformDistanceMatrixToGraphData(distanceMatrix, samples, graphStore.settings.filter);

        // Update the graph settings with the new graph data
        graphStore.updateData(graphData);
    }, [samples, distanceMatrix, graphStore.settings.filter]);

    // useMemo to prevent unnecessary re-renders
    const graphDataCopy = useMemo(() => graphStore.data, [graphStore.settings]);

    const getLegend = () => {
        const nodes = graphStore.data.nodes;

        if (graphStore.settings.coloring === "normal" || graphStore.settings.coloring === "outbreaks") {
            const uniqueGroups = nodes.filter((group, index, self) => {
                return index === self.findIndex((t) => t.group === group.group);
            });
            return uniqueGroups.map((node) => (
                <div className="flex items-center gap-2" key={node.group}>
                    <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                    <p>{node.group}</p>
                </div>
            ));
        } else if (graphStore.settings.coloring === "sampled_at") {
            const uniqueSamplingTimes = getUniqueSamplingTimes(nodes);

            return uniqueSamplingTimes.map((node) => (
                <div className="flex items-center gap-2" key={node.sampledAt}>
                    <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                    <p>{node.sampledAt || "Kein Datum angegeben"}</p>
                </div>
            ));
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
            <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-4 bg-muted">
                <legend className="-ml-1 px-1 text-sm font-medium">Legende</legend>
                <div className="flex flex-col">
                    <Label htmlFor="role" className="mb-2">
                        Cluster
                    </Label>
                    {getLegend()}
                </div>
            </fieldset>
            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                <ForcedDirectedGraph2D data={graphDataCopy as GraphData} width={width - 8} height={height - 8} />
            </div>
        </div>
    );
};
