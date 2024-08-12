import { useEffect, useRef, useState } from "react";
import { createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { useAnalysisStore } from "@/stores/analysis";
import { Graph2D } from "../graphs/Graph2D";
import { AnalysisGraphSettings } from "./AnalysisGraphSettings";
import { Legend } from "./Legend";
import { Loader2 } from "lucide-react";
import { useGetAllContacts } from "@/hooks/database/contacts/useGetAllContacts";

export const AnalysisVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const analysisStore = useAnalysisStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const contacts = useGetAllContacts();
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const [showGraphSettings, setShowGraphSettings] = useState(false);

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases || !contacts) {
            analysisStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        createGraphData(distanceMatrixAssembly, cases, analysisStore.settings, contacts).then((graphData) => {
            analysisStore.updateGraphData(graphData);
        });
    }, [cases, distanceMatrixAssembly, analysisStore.settings, contacts]);

    const renderGraph = () => {
        if (analysisStore.graphData.nodes.length === 0 && analysisStore.settings.selectedOutbreak && !cases) {
            return <Loader2 className="h-24 w-h-24 animate-spin" />;
        } else if (analysisStore.graphData.nodes.length === 0 && cases && cases.length === 0) {
            return <div className="flex justify-center items-center h-full w-full">Keine Daten vorhanden</div>;
        }

        return (
            <Graph2D
                data={analysisStore.graphData}
                width={width - 8}
                height={height - 8}
                colorMap={analysisStore.settings.colorMap}
                showNodeLabel={analysisStore.graphSettings.showNodeLabel}
                linkDistance={analysisStore.graphSettings.linkDistance}
            />
        );
    };

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col justify-center items-center h-[85vh] rounded-xl bg-muted lg:col-span-2"
        >
            {analysisStore.settings.selectedOutbreak ? (
                <>
                    <Legend
                        nodes={analysisStore.graphData.nodes}
                        links={analysisStore.graphData.links}
                        colorMap={analysisStore.settings.colorMap}
                        isOutbreakSeparated
                    />
                    <AnalysisGraphSettings
                        showGraphSettings={showGraphSettings}
                        updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                    />
                    {renderGraph()}
                </>
            ) : (
                <div className="flex justify-center items-center h-full w-full font-semibold">
                    Wählen sie einen Ausbruch aus, um mit der Analyse zu starten.
                </div>
            )}
        </div>
    );
};
