import { ColorMap, CustomLink, CustomNode } from "@/modules/core/types/graph";
import { Label } from "@/modules/core/components/ui/Label";
import {
    getRegisteredAtTimestamps,
    getSelectedClusters,
    getUniqueClusters,
    getUniqueTypesOfLinks,
    moveNoOutbreakAssignedToEnd,
} from "@/modules/core/helpers/graphs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ColorCircle } from "./ColorCircle";

type LegendProps = {
    nodes: CustomNode[];
    links: CustomLink[];
    colorMap: ColorMap;
    variant: "outbreakAnalysis" | "dashboard" | "timeSpan";
};

export const Legend = ({ nodes, links, colorMap, variant }: LegendProps) => {
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [nodes]);
    const clusterNames = useMemo(() => {
        const uniqueClusterNames = getUniqueClusters(nodes);
        return moveNoOutbreakAssignedToEnd(uniqueClusterNames);
    }, [nodes, variant]);
    const registeredAtTimeStamps = useMemo(() => getRegisteredAtTimestamps(nodes), [nodes, variant]);
    const uniqueTypesOfLinks = useMemo(() => getUniqueTypesOfLinks(links), [links]);
    const { t } = useTranslation();

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

    const renderLinkItems = (links: CustomLink[]) => {
        return links.map((link) => (
            <div className="flex items-center gap-2" key={link.type}>
                <span style={{ backgroundColor: `${link.color}` }} className={"h-[3px] w-5 mt-[3px]"} />
                <p className="text-xs">{link.type}</p>
            </div>
        ));
    };

    const renderBackgroundLegend = () => {
        if (selectedBackground.length === 0) return null;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Ausgewählter Background</Label>
                {renderClusterItems(selectedBackground)}
            </div>
        );
    };

    const renderLinkLegend = () => {
        const geneticDistanceLinks = uniqueTypesOfLinks.filter((link) => link.type === t(`linkTypes.geneticDistance`));
        const contactTracingLinks = uniqueTypesOfLinks.filter((link) => link.type !== t(`linkTypes.geneticDistance`));
        return (
            <div className="flex flex-col mt-2">
                {geneticDistanceLinks.length > 0 && (
                    <div className="flex flex-col">
                        <Label className="-ml-1 px-1 text-xs font-medium">Genetische Kanten</Label>
                        {renderLinkItems(geneticDistanceLinks)}
                    </div>
                )}
                {contactTracingLinks.length > 0 && (
                    <div className="flex flex-col mt-2">
                        <Label className="-ml-1 px-1 text-xs font-medium">Kontaktkanten</Label>
                        {renderLinkItems(contactTracingLinks)}
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
        <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-3 bg-muted/80 pointer-events-none pdf-canvas graph-legend">
            <legend className="-ml-1 px-1 text-xs font-bold -mb-2 pdf-hide">Legende</legend>
            {renderNodeLegend()}
            {renderLinkLegend()}
        </fieldset>
    );
};
