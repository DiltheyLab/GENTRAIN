import { useEffect, useRef, useState } from "react";
import { createColorMapForTimeSpan, createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { AnalysisSettings, useAnalysisStore } from "@/stores/analysis";
import { Graph2D } from "../graphs/Graph2D";
import { AnalysisGraphSettings } from "./AnalysisGraphSettings";
import { Legend } from "../graphs/panelLayout/Legend";
import { useGetAllContacts } from "@/hooks/database/contacts/useGetAllContacts";
import { CaseWithRelationships } from "@/database/cases";
import { ContactSchema } from "@/database/contacts";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { CaseInfo } from "../graphs/panelLayout/CaseInfo";

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

    useEffect(() => {
        if (!distanceMatrixAssembly || !cases || !contacts) {
            analysisStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        const getGraphData = async (
            distanceMatrixAssembly: DistanceMatrixAssembly,
            cases: CaseWithRelationships[],
            settings: AnalysisSettings,
            contacts: ContactSchema[]
        ) => {
            const graphData = await createGraphData(distanceMatrixAssembly, cases, settings, contacts);
            analysisStore.updateGraphData(graphData);
        };

        getGraphData(distanceMatrixAssembly, cases, analysisStore.settings, contacts);
    }, [cases, distanceMatrixAssembly, analysisStore.settings, contacts]);

    useEffect(() => {
        // create color map for time span every time the cases change
        const colorMap = createColorMapForTimeSpan(analysisStore.graphData.nodes);
        const currentColorMap = { ...analysisStore.graphSettings.colorMap };
        // merge the timeSpan colorMap with the current color map in case there are already colors set and prevent overwriting
        analysisStore.updateGraphSettings({ colorMap: { ...currentColorMap, ...colorMap } });
    }, [analysisStore.graphData.nodes]);

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
                        colorMap={analysisStore.graphSettings.colorMap}
                        variant={analysisStore.graphSettings.isColoredByTimeSpan ? "timeSpan" : "outbreakAnalysis"}
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
                        isColoredByTimeSpan={analysisStore.graphSettings.isColoredByTimeSpan}
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
