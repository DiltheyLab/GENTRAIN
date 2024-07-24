import { Button } from "../ui/button";
import { ForcedDirectedGraph2D } from "../graphs/ForcedDirectedGraph";
import { useEffect, useMemo, useRef } from "react";
import { deepCopyData } from "@/lib/utils";
import { transformDistanceMatrixToGraphData } from "@/services/graphs";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { type GraphData } from "@/stores/graph";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { useAnalysisStore } from "@/stores/analysis";
import { AnalysisGraph } from "./AnalysisGraph";

export const AnalysisVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const analyseStore = useAnalysisStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);

    const cases = useGetAllCasesWithRelationships();

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases) {
            analyseStore.updateGraphData({ nodes: [], links: [] });
            return;
        }
        const graphData = transformDistanceMatrixToGraphData(distanceMatrixAssembly, cases, analyseStore.settings);
        analyseStore.updateGraphData(graphData);
    }, [cases, distanceMatrixAssembly, analyseStore.settings]);

    // Creating deep copy of the graph data for each graph component and
    // use useMemo hook to safe the graphData with updated simulation data to prevent to start simulation
    // from beginning after every rerendering
    const graphDataCopy = useMemo(() => {
        return deepCopyData(analyseStore.graphData);
    }, [analyseStore.graphData]);

    const getGraph = () => {
        if (width && height) {
            return <AnalysisGraph data={graphDataCopy as GraphData} width={width - 8} height={height - 8} />;
        }
    };

    /*     const getLegend = () => {
        const nodes = analyseStore..nodes;
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
        } else if (graphStore.settings.coloring === "registered_at") {
            const uniqueSamplingTimes = getUniqueSamplingTimes(nodes);

            return uniqueSamplingTimes.map((node) => (
                <div className="flex items-center gap-2" key={node.registeredAt}>
                    <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                    <p>{node.registeredAt || "Kein Datum angegeben"}</p>
                </div>
            ));
        }
    }; */

    return (
        <div ref={containerRef} className="relative flex h-full flex-col rounded-xl bg-muted lg:col-span-2">
            <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-4 bg-muted">
                <legend className="-ml-1 px-1 text-sm font-medium">Legende</legend>
                <div className="flex flex-col">
                    <Label htmlFor="role" className="mb-2">
                        Cluster
                    </Label>
                </div>
            </fieldset>
            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                {getGraph()}
            </div>
        </div>
    );
};
