import { useEffect, useRef, useState } from "react";
import { createGraphData } from "@/services/graphs";
import { useAppStore } from "@/stores/app";
import { useResizeContainer } from "@/hooks/useResizeContainer";
import { useGetDistanceMatrixAssemblyByPathogenId } from "@/hooks/database/distance_matrices/useGetDistanceMatrixAssemblyByPathogenId";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { AnalysisSettings, useAnalysisStore } from "@/stores/analysis";
import { Graph2D } from "../graphs/Graph2D";
import { CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { AnalysisGraphSettings } from "./AnalysisGraphSettings";
import { Legend } from "./Legend";
import { Loader2 } from "lucide-react";
import { useGetAllContacts } from "@/hooks/database/contacts/useGetAllContacts";
import { ContactSchema } from "@/database/contacts";

export const AnalysisVisualizationPanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, height] = useResizeContainer(containerRef.current);
    const analyseStore = useAnalysisStore();
    const activePathogen = useAppStore((state) => state.activePathogen);
    const distanceMatrixAssembly = useGetDistanceMatrixAssemblyByPathogenId(activePathogen?.id);
    const contacts = useGetAllContacts();
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const [showGraphSettings, setShowGraphSettings] = useState(false);
    useEffect(() => {
        if (!distanceMatrixAssembly || !cases || !contacts) {
            analyseStore.updateGraphData({ nodes: [], links: [] });
            return;
        }

        const getGraphData = async (
            distanceMatrixAssembly: DistanceMatrixAssembly,
            cases: CaseWithRelationships[],
            settings: AnalysisSettings,
            contacts: ContactSchema[]
        ) => {
            const graphData = await createGraphData(distanceMatrixAssembly, cases, settings, contacts);
            analyseStore.updateGraphData(graphData);
        };

        getGraphData(distanceMatrixAssembly, cases, analyseStore.settings, contacts);
    }, [cases, distanceMatrixAssembly, analyseStore.settings, contacts]);

    const renderGraph = () => {
        if (analyseStore.graphData.nodes.length === 0 && analyseStore.settings.selectedOutbreak && !cases) {
            return <Loader2 className="h-24 w-h-24 animate-spin" />;
        } else if (analyseStore.graphData.nodes.length === 0 && cases && cases.length === 0) {
            return <div className="flex justify-center items-center h-full w-full">Keine Daten vorhanden</div>;
        }
        return (
            <Graph2D
                data={analyseStore.graphData}
                width={width - 8}
                height={height - 8}
                showNodeLabel={analyseStore.graphSettings.showNodeLabel}
                linkDistance={analyseStore.graphSettings.linkDistance}
            />
        );
    };

    return (
        <div
            ref={containerRef}
            className="relative flex flex-col justify-center items-center h-[85vh] rounded-xl bg-muted lg:col-span-2"
        >
            {analyseStore.settings.selectedOutbreak ? (
                <>
                    <Legend
                        nodes={analyseStore.graphData.nodes}
                        links={analyseStore.graphData.links}
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
