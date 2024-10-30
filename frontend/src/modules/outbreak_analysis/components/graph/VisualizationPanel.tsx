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
import { GraphDataGenerator } from "@/modules/core/services/graph/GraphDataGenerator";
import { useCoreStore } from "@/modules/core/stores/core";
import { CustomNode } from "@/modules/core/types/graph";
import { useLinksBelowGeneticDistanceThreshold } from "@/modules/core/hooks/graph/useLinksBelowGeneticDistanceThreshold";
import { AnalysisInfo } from "./AnalysisInfo";

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
    const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
    const geneticDistanceThreshold = useCoreStore((state) => state.activePathogen?.genetic_distance_threshold);
    const [linksBelowGeneticDistanceThreshold, setAllLinks] = useLinksBelowGeneticDistanceThreshold(
        geneticDistanceThreshold ?? 0,
        selectedNode
    );

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
            outbreakAnalysisStore.analysisSettings
        );
        graphDataGenerator.execute().then((graphData) => {
            outbreakAnalysisStore.updateGraphData(graphData);
            setAllLinks(graphDataGenerator.getAllLinks());
        });
    }, [cases, distanceMatrixAssembly, outbreakAnalysisStore.analysisSettings, contacts]);

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col justify-center items-center rounded-lg bg-muted lg:col-span-2 graph-visualization-panel h-full"
        >
            {outbreakAnalysisStore.analysisSettings.selectedOutbreak ? (
                <>
                    <AnalysisInfo
                        name={outbreakAnalysisStore.name}
                        autoSave={outbreakAnalysisStore.generalSettings.autoSave}
                        onAutoSaveChange={(value) => outbreakAnalysisStore.updateGeneralSettings({ autoSave: value })}
                    />
                    <Legend
                        nodes={outbreakAnalysisStore.graphData.nodes}
                        links={outbreakAnalysisStore.graphData.links}
                        colorMap={outbreakAnalysisStore.graphSettings.colorMap}
                        linksBelowGeneticDistanceThreshold={linksBelowGeneticDistanceThreshold}
                        geneticDistanceThreshold={geneticDistanceThreshold}
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
                        selectedNode={selectedNode}
                        updateSelectedNode={(selectedNode) => setSelectedNode(selectedNode)}
                    />
                    <Graph2D
                        data={outbreakAnalysisStore.graphData}
                        width={width}
                        height={height}
                        colorMap={colorMap}
                        coloringMode={coloringMode}
                        cases={cases}
                        charge={charge}
                        linkDistance={linkDistance}
                        nodeSize={nodeSize}
                        showNodeLabel={showNodeLabel}
                        linkWidth={linkWidth}
                        updateSelectedNode={(selectedNode) => setSelectedNode(selectedNode)}
                        selectedNode={selectedNode}
                        isLoading={typeof distanceMatrixAssembly === "undefined" || !contacts || !cases}
                        linksBelowGeneticDistanceThreshold={linksBelowGeneticDistanceThreshold}
                        initialZoomToFit={true}
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
