import { useEffect, useRef, useState } from "react";
import { createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { AnalysisSettings, useAnalysisStore } from "@/stores/analysis";
import { Graph2D } from "../graphs/Graph2D";
import { AnalysisGraphSettings } from "./AnalysisGraphSettings";
import { Legend } from "./Legend";
import { useGetAllContacts } from "@/hooks/database/contacts/useGetAllContacts";
import { CaseWithRelationships } from "@/database/cases";
import { ContactSchema } from "@/database/contacts";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";

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
                        isOutbreakSeparated
                    />
                    <AnalysisGraphSettings
                        showGraphSettings={showGraphSettings}
                        updateShowGraphSettings={(showGraphSettings) => setShowGraphSettings(showGraphSettings)}
                    />
                    <Graph2D
                        data={analysisStore.graphData}
                        width={width - 8}
                        height={height - 8}
                        colorMap={analysisStore.graphSettings.colorMap}
                        cases={cases}
                        showNodeLabel={analysisStore.graphSettings.showNodeLabel}
                        linkDistance={analysisStore.graphSettings.linkDistance}
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
