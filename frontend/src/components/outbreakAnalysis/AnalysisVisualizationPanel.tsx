import { useEffect, useRef, useState } from "react";
import { createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { AnalysisSettings, useAnalysisStore } from "@/stores/analysis";
import { AnalysisGraph } from "./AnalysisGraph";
import { CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { AnalysisGraphSettings } from "./AnalysisGraphSettings";
import { Legend } from "./Legend";
import { Loader2 } from "lucide-react";

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

    return (
        <div ref={containerRef} className="relative flex h-full flex-col rounded-xl bg-muted lg:col-span-2">
            {analyseStore.settings.selectedOutbreak && (
                <>
                    <Legend nodes={analyseStore.graphData.nodes} />
                    <AnalysisGraphSettings
                        showGraphSettings={showGraphSettings}
                        updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                    />
                </>
            )}
            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                {analyseStore.graphData.nodes.length !== 0 ? (
                    <AnalysisGraph data={analyseStore.graphData} width={width - 8} height={height - 8} />
                ) : (
                    <Loader2 className="h-24 w-h-24 animate-spin" />
                )}
            </div>
        </div>
    );
};
