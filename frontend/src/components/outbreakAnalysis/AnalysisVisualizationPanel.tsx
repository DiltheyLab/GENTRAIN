import { useEffect, useMemo, useRef, useState } from "react";
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
import { AnalysisGraphSettings } from "./AnalysisGraphSettings";
import { Legend } from "./Legend";

export const AnalysisVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const analyseStore = useAnalysisStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const cases = useGetAllCasesWithRelationships();
    const [showGraphSettings, setShowGraphSettings] = useState(false);

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

    return (
        <div ref={containerRef} className="relative flex h-full flex-col rounded-xl bg-muted lg:col-span-2">
            {analyseStore.settings.selectedOutbreak && (
                <>
                    <Legend />
                    <AnalysisGraphSettings
                        showGraphSettings={showGraphSettings}
                        updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                    />
                </>
            )}
            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                {getGraph()}
            </div>
        </div>
    );
};
