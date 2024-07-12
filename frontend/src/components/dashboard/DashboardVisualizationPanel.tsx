import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ForcedDirectedGraph2D } from "../graphs/ForcedDirectedGraph";
import { GraphData, useGraphSettings } from "@/providers/GraphSettingsProvider";
import { ForcedDirectedGraph3D } from "../graphs/ForcedDirectedGraph3D";
import { useEffect, useMemo, useRef } from "react";
import { deepCopyData } from "@/lib/utils";
import { getUniqueSamplingTimes, transformDistanceMatrixToGraphData } from "@/services/graphs";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixByPathogenId";
import { useGetAllSamples } from "@/hooks/database/samples/useGetAllSamples";

export const DashboardVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const graphSettingsContext = useGraphSettings();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrix = useGetDistanceMatrixByPathogenId(activePathogen?.id);
    const samples = useGetAllSamples();

    useEffect(() => {
        if (!graphSettingsContext || !distanceMatrix || !samples) {
            graphSettingsContext?.updateSettings({ graphData: { nodes: [], links: [] } });
            return;
        }

        const graphData = transformDistanceMatrixToGraphData(
            distanceMatrix,
            samples,
            graphSettingsContext.settings.filter
        );

        // Update the graph settings with the new graph data
        graphSettingsContext.updateSettings({ graphData });
    }, [samples, distanceMatrix, graphSettingsContext?.settings.filter]);

    // Creating deep copy of the graph data for each graph component and
    // use useMemo hook to safe the graphData with updated simulation data to prevent to start simulation
    // from beginning after every rerendering
    const graphDataCopy = useMemo(() => {
        if (graphSettingsContext) {
            return deepCopyData(graphSettingsContext.settings.graphData);
        }
    }, [graphSettingsContext?.settings.graphData]);

    const getGraph = () => {
        if (graphSettingsContext?.settings.graphDimension === "2D" && width && height) {
            return <ForcedDirectedGraph2D data={graphDataCopy as GraphData} width={width - 8} height={height - 8} />;
        } else if (graphSettingsContext?.settings.graphDimension === "3D" && width && height) {
            return <ForcedDirectedGraph3D data={graphDataCopy as GraphData} width={width - 8} height={height - 8} />;
        }
    };

    const getLegend = () => {
        if (!graphSettingsContext) {
            return;
        }
        const nodes = graphSettingsContext.settings.graphData.nodes;

        if (
            graphSettingsContext.settings.coloring === "normal" ||
            graphSettingsContext.settings.coloring === "outbreaks"
        ) {
            const uniqueGroups = nodes.filter((group, index, self) => {
                return index === self.findIndex((t) => t.group === group.group);
            });
            return uniqueGroups.map((node) => (
                <div className="flex items-center gap-2" key={node.group}>
                    <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                    <p>{node.group}</p>
                </div>
            ));
        } else if (graphSettingsContext.settings.coloring === "sampled_at") {
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
                {graphSettingsContext?.settings.graphDimension}
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
                {getGraph()}
            </div>
        </div>
    );
};
