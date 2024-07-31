import { useEffect, useRef, useState } from "react";
import { createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { AnalysisSettings, useAnalysisStore } from "@/stores/analysis";
import { Graph2D } from "../graphs/Graph2D";
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

    const renderGraph = () => {
        if (analyseStore.graphData.nodes.length === 0 && analyseStore.settings.selectedOutbreak && !cases) {
            return <Loader2 className="h-24 w-h-24 animate-spin" />;
        } else if (analyseStore.graphData.nodes.length === 0 && cases && cases.length === 0) {
            return <div className="flex justify-center items-center h-full w-full">Keine Daten vorhanden</div>;
        } else if (!analyseStore.settings.selectedOutbreak) {
            return (
                <div className="flex justify-center items-center h-full w-full">
                    Wählen sie einen Ausbruch aus, um mit der Analyse zu starten.
                </div>
            );
        }
        return (
            <Graph2D
                data={analyseStore.graphData}
                width={width - 8}
                height={height - 8}
                hideNodeLabel={analyseStore.graphSettings.hideNodeLabel}
                linkDistance={analyseStore.graphSettings.linkDistance}
            />
        );
    };

    return (
        <div ref={containerRef} className="relative flex h-full flex-col rounded-xl bg-muted lg:col-span-2">
            {analyseStore.settings.selectedOutbreak && (
                <>
                    <Legend nodes={analyseStore.graphData.nodes} isOutbreakSeparated />
                    <AnalysisGraphSettings
                        showGraphSettings={showGraphSettings}
                        updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                    />
                </>
            )}
            <div className=" flex justify-center items-center h-full w-full" id="graph-container">
                {renderGraph()}
            </div>
        </div>
    );
};
