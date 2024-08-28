import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { useAnalysisStore } from "@/stores/analysis";
import { Graph2D } from "../graphs/Graph2D";
import { AnalysisGraphSettings } from "./AnalysisGraphSettings";
import { Legend } from "../graphs/panelLayout/Legend";
import { useGetAllContacts } from "@/hooks/database/contacts/useGetAllContacts";
import { CaseWithRelationships } from "@/database/cases";
import { CaseInfo } from "../graphs/panelLayout/CaseInfo";
import { useCreateColorMapForTimeSpan } from "@/hooks/useCreateColorMapForTimeSpan";
import { useLocation } from "react-router-dom";
import { GraphDataGenerator } from "@/services/Graph/GraphDataGenerator";

export const AnalysisVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const analysisStore = useAnalysisStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const contacts = useGetAllContacts();
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const [showGraphSettings, setShowGraphSettings] = useState(false);
    const [selectedCase, setSelectedCase] = useState<CaseWithRelationships | null>(null);
    const pathname = decodeURI(useLocation().pathname.split("/")[2]);

    // update color map for time span every time the cases (nodes) change
    useCreateColorMapForTimeSpan(
        analysisStore.graphData.nodes,
        analysisStore.graphSettings,
        analysisStore.updateGraphSettings
    );

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases || !contacts) {
            analysisStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        const graphDataGenerator = new GraphDataGenerator(
            cases,
            distanceMatrixAssembly,
            contacts,
            analysisStore.settings
        );
        graphDataGenerator.execute().then((graphData) => analysisStore.updateGraphData(graphData));
    }, [cases, distanceMatrixAssembly, analysisStore.settings, contacts]);

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col justify-center items-center h-[85vh] rounded-xl bg-muted lg:col-span-2"
        >
            {analysisStore.settings.selectedOutbreak ? (
                <>
                    <fieldset className="absolute z-10 left-2 bottom-2 rounded-lg w-fit border px-2 py-1 text-sm font-medium bg-muted/80 pointer-events-none">
                        Analyse: {pathname}
                    </fieldset>
                    <Legend
                        nodes={analysisStore.graphData.nodes}
                        links={analysisStore.graphData.links}
                        colorMap={analysisStore.graphSettings.colorMap}
                        variant={
                            analysisStore.graphSettings.coloringMode === "timeSpan" ? "timeSpan" : "outbreakAnalysis"
                        }
                    />
                    <AnalysisGraphSettings
                        showGraphSettings={showGraphSettings}
                        updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                    />
                    <CaseInfo
                        selectedCase={selectedCase}
                        updateSelectedCase={(selectedCase) => setSelectedCase(selectedCase)}
                    />
                    <Graph2D
                        data={analysisStore.graphData}
                        width={width - 8}
                        height={height - 8}
                        colorMap={analysisStore.graphSettings.colorMap}
                        coloringMode={analysisStore.graphSettings.coloringMode}
                        cases={cases}
                        showNodeLabel={analysisStore.graphSettings.showNodeLabel}
                        linkDistance={analysisStore.graphSettings.linkDistance}
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
