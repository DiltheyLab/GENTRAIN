import { useEffect, useRef, useState } from "react";
import { useResizeContainer } from "@/modules/core/hooks/useResizeContainer";
import { useGetDistanceMatrixAssembly } from "@/modules/core/hooks/database/distance_matrices/useGetDistanceMatrixAssembly";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { Graph2D } from "@/modules/core/components/graph/Graph2D";
import { GraphSettings } from "../../../core/components/graph/GraphSettings";
import { Legend } from "@/modules/core/components/graph/Legend";
import { useGetAllContacts } from "@/modules/core/hooks/database/contacts/useGetAllContacts";
import { CaseInfo } from "@/modules/core/components/graph/CaseInfo";
import { useCreateColorMapForTimeSpan } from "@/modules/core/hooks/graph/useCreateColorMapForTimeSpan";
import { useLocation } from "react-router-dom";
import { GraphDataGenerator } from "@/modules/core/services/graph/GraphDataGenerator";
import { useCoreStore } from "@/modules/core/stores/core";
import { CaseWithRelationships } from "@/modules/core/models/cases";

export const VisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const outbreakAnalysisStore = useOutbreakAnalysisStore();
    const { charge, showNodeLabel, linkDistance, linkWidth, nodeSize, colorMap, coloringMode } =
        outbreakAnalysisStore.graphSettings;
    const distanceMatrixAssembly = useGetDistanceMatrixAssembly();
    const contacts = useGetAllContacts();
    const cases = useCoreStore((state) => state.casesWithRelationships);
    const [showGraphSettings, setShowGraphSettings] = useState(false);
    const [selectedCase, setSelectedCase] = useState<CaseWithRelationships | null>(null);
    const pathname = decodeURI(useLocation().pathname.split("/")[2]);
    // update color map for time span every time the cases (nodes) change
    useCreateColorMapForTimeSpan(
        outbreakAnalysisStore.graphData.nodes,
        outbreakAnalysisStore.graphSettings,
        outbreakAnalysisStore.updateGraphSettings
    );

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases || !contacts) {
            outbreakAnalysisStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        const graphDataGenerator = new GraphDataGenerator(
            cases,
            distanceMatrixAssembly,
            contacts,
            outbreakAnalysisStore.settings
        );
        graphDataGenerator.execute().then((graphData) => outbreakAnalysisStore.updateGraphData(graphData));
    }, [cases, distanceMatrixAssembly, outbreakAnalysisStore.settings, contacts]);

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col justify-center items-center rounded-lg bg-muted lg:col-span-2 graph-visualization-panel h-full"
        >
            {outbreakAnalysisStore.settings.selectedOutbreak ? (
                <>
                    <fieldset className="absolute z-10 left-2 bottom-2 rounded-lg w-fit border px-2 py-1 text-sm font-medium bg-muted/80 pointer-events-none">
                        Analyse: {pathname}
                    </fieldset>
                    <Legend
                        nodes={outbreakAnalysisStore.graphData.nodes}
                        links={outbreakAnalysisStore.graphData.links}
                        colorMap={outbreakAnalysisStore.graphSettings.colorMap}
                        variant={
                            outbreakAnalysisStore.graphSettings.coloringMode === "timeSpan"
                                ? "timeSpan"
                                : "outbreakAnalysis"
                        }
                    />
                    <GraphSettings
                        showGraphSettings={showGraphSettings}
                        updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                        graphSettings={outbreakAnalysisStore.graphSettings}
                        updateGraphSettings={outbreakAnalysisStore.updateGraphSettings}
                    />
                    <CaseInfo
                        selectedCase={selectedCase}
                        updateSelectedCase={(selectedCase) => setSelectedCase(selectedCase)}
                    />
                    <Graph2D
                        data={outbreakAnalysisStore.graphData}
                        width={width - 8}
                        height={height - 8}
                        colorMap={colorMap}
                        coloringMode={coloringMode}
                        cases={cases}
                        charge={charge}
                        linkDistance={linkDistance}
                        nodeSize={nodeSize}
                        showNodeLabel={showNodeLabel}
                        linkWidth={linkWidth}
                        updateSelectedCase={(selectedCase) => setSelectedCase(selectedCase)}
                        selectedCase={selectedCase}
                    />
                </>
            ) : (
                <div className="flex justify-center items-center h-full w-full font-semibold">
                    Wählen sie einen Ausbruch aus, um mit der Analyse zu starten.
                </div>
            )}
        </div>
    );
};
