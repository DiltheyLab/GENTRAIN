import { ColorMap, CustomLink, CustomNode } from "@/modules/core/types/graph";
import { Label } from "@/modules/core/components/ui/Label";
import {
    categorizeLinks,
    getRegisteredAtTimestamps,
    getSelectedClusters,
    getUniqueClusters,
    moveNoOutbreakAssignedToEnd,
} from "@/modules/core/helpers/graphs";
import { useMemo } from "react";
import { ColorCircle } from "./ColorCircle";

type LegendProps = {
    nodes: CustomNode[];
    links: CustomLink[];
    colorMap: ColorMap;
    variant: "outbreakAnalysis" | "dashboard" | "timeSpan";
    linksBelowGeneticDistanceThreshold?: CustomLink[];
    geneticDistanceThreshold?: number;
};

export const Legend = ({
    nodes,
    links,
    colorMap,
    variant,
    linksBelowGeneticDistanceThreshold,
    geneticDistanceThreshold,
}: LegendProps) => {
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [nodes]);
    const clusterNames = useMemo(() => {
        const uniqueClusterNames = getUniqueClusters(nodes);
        return moveNoOutbreakAssignedToEnd(uniqueClusterNames);
    }, [nodes, variant]);
    const registeredAtTimeStamps = useMemo(() => getRegisteredAtTimestamps(nodes), [nodes, variant]);
    const { geneticDistanceLinksBelowThreshold, geneticDistanceLinksAboveThreshold, contactTracingLinks } = useMemo(
        () => categorizeLinks(links, geneticDistanceThreshold),
        [links]
    );

    const renderClusterItems = (clusters: string[]) => {
        return clusters.map((cluster) => (
            <div className="flex items-center gap-2" key={cluster}>
                <ColorCircle cluster={cluster} colorMap={colorMap} />
                <p className="text-xs">{cluster}</p>
            </div>
        ));
    };

    const renderTimeSpan = (timestamps: string[]) => {
        const startDate = timestamps[0];
        const endDate = timestamps[timestamps.length - 1];

        return (
            <>
                <Label className="-ml-1 px-1 text-xs font-medium">Zeitraum</Label>
                <div
                    style={{
                        backgroundImage: `linear-gradient(to right, ${colorMap[startDate]?.color}, ${colorMap[endDate]?.color})`,
                    }}
                    className="w-full h-5 rounded-md min-w-36"
                />
                <div className="flex flex-row justify-between">
                    <p className="text-xs">{startDate}</p>
                    <p className="text-xs">{endDate}</p>
                </div>
            </>
        );
    };

    const renderBackgroundLegend = () => {
        if (selectedBackground.length === 0) return null;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Ausgewählter Umgebung</Label>
                {renderClusterItems(selectedBackground)}
            </div>
        );
    };

    const renderLinkLegend = () => {
        return (
            <div className="flex flex-col mt-2">
                {(geneticDistanceLinksAboveThreshold.length > 0 || geneticDistanceLinksBelowThreshold.length > 0) && (
                    <div className="flex flex-col">
                        <Label className="-ml-1 px-1 text-xs font-medium">Genetische Kanten</Label>
                        {geneticDistanceLinksBelowThreshold.map((link) => (
                            <div className="flex items-center gap-2" key={link.type}>
                                <span style={{ backgroundColor: `${link.color}` }} className={"h-[3px] w-6"} />
                                <p className="text-xs">Genetische Distanz &le; {geneticDistanceThreshold} </p>
                            </div>
                        ))}
                        {geneticDistanceLinksAboveThreshold.map((link) => (
                            <div className="flex items-center gap-2" key={link.type}>
                                <span
                                    className={"h-[3px] w-6 border-b-[3px] border-dashed"}
                                    style={{ borderColor: `${link.color}` }}
                                />
                                <p className="text-xs">Genetische Distanz &gt; {geneticDistanceThreshold} </p>
                            </div>
                        ))}
                    </div>
                )}
                {linksBelowGeneticDistanceThreshold && linksBelowGeneticDistanceThreshold.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className={"h-[3px] w-6 border-b-[3px] border-red-500 border-dashed"} />
                        <p className="text-xs">Genetische Distanz &le; {geneticDistanceThreshold} </p>
                    </div>
                )}

                {contactTracingLinks.length > 0 && (
                    <div className="flex flex-col mt-2">
                        <Label className="-ml-1 px-1 text-xs font-medium">Kontaktkanten</Label>
                        {contactTracingLinks.map((link) => (
                            <div className="flex items-center gap-2" key={link.type}>
                                <span style={{ backgroundColor: `${link.color}` }} className={"h-[3px] w-6"} />
                                <p className="text-xs">{link.type}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderOutbreakLegend = () => {
        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Ausgewählter Ausbruch</Label>
                {selectedOutbreak.length === 0 ? (
                    <p className="text-xs text-red-600">Nicht im Graphen enthalten!</p>
                ) : (
                    renderClusterItems(selectedOutbreak)
                )}
            </div>
        );
    };

    const renderNodeLegend = () => {
        switch (variant) {
            case "dashboard":
                return <div className="flex flex-col">{renderClusterItems(clusterNames)}</div>;

            case "outbreakAnalysis":
                return (
                    <div className="flex flex-col gap-2">
                        {renderOutbreakLegend()}
                        {renderBackgroundLegend()}
                    </div>
                );
            case "timeSpan":
                return <div className="flex flex-col">{renderTimeSpan(registeredAtTimeStamps)}</div>;
        }
    };

    if (!nodes || nodes.length === 0) return null;

    return (
        <fieldset
            className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-3 bg-muted/90 pointer-events-none"
            data-tutorial-tour-step="dashboard-visualization-panel-legend"
        >
            <legend className="-ml-1 px-1 text-xs font-bold -mb-2">Legende</legend>
            {renderNodeLegend()}
            {renderLinkLegend()}
        </fieldset>
    );
};
