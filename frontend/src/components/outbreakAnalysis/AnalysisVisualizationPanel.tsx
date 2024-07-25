import { useEffect, useMemo, useRef } from "react";
import { deepCopyData } from "@/lib/utils";
import { createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { type GraphData } from "@/stores/graph";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { AnalysisSettings, useAnalysisStore } from "@/stores/analysis";
import { AnalysisGraph } from "./AnalysisGraph";
import { CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";

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

        const getGraphData = async (
            distanceMatrixAssembly: DistanceMatrixAssembly,
            cases: CaseWithRelationships[],
            settings: AnalysisSettings
        ) => {
            const graphData = await createGraphData(distanceMatrixAssembly, cases, settings);
            analyseStore.updateGraphData(graphData);
        };

        getGraphData(distanceMatrixAssembly, cases, analyseStore.settings);
    }, [cases, distanceMatrixAssembly, analyseStore.settings]);

    // Creating deep copy of the graph data for each graph component and
    // use useMemo hook to safe the graphData with updated simulation data to prevent to start simulation
    // from beginning after every rerendering
    const graphDataCopy = useMemo(() => {
        return deepCopyData(analyseStore.graphData);
    }, [analyseStore.graphData]);

    const getGraph = () => {
        if (width && height && analyseStore.settings.selectedOutbreak) {
            return <AnalysisGraph data={graphDataCopy as GraphData} width={width - 8} height={height - 8} />;
        }
    };

    const getLegend = () => {
        const nodes = analyseStore.graphData.nodes;
        const uniqueGroups = nodes
            .filter((group, index, self) => {
                return index === self.findIndex((node) => node.group === group.group);
            })
            .sort((a, b) => a.group.localeCompare(b.group));
        return uniqueGroups.map((node) => (
            <div className="flex items-center gap-2" key={node.group}>
                <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                <p>{node.group}</p>
            </div>
        ));
    };

    return (
        <div ref={containerRef} className="relative flex h-full flex-col rounded-xl bg-muted lg:col-span-2">
            {analyseStore.settings.selectedOutbreak && (
                <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-4 bg-muted">
                    <legend className="-ml-1 px-1 text-sm font-medium">Legende</legend>
                    <div className="flex flex-col">{getLegend()}</div>
                </fieldset>
            )}
            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                {getGraph()}
            </div>
        </div>
    );
};
