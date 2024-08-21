import { ColorMap, CustomLink, CustomNode } from "@/types/graph";
import { Label } from "../../ui/label";
import {
    getRegisteredAtTimestamps,
    getSelectedClusters,
    getUniqueClustersOfNodes,
    getUniqueTypesOfLinks,
} from "@/services/graphs";
import { useMemo } from "react";
import { COLOR_FOR_CASES_WITHOUT_OUTBREAKS } from "@/colors/colorPalettes";
import { useTranslation } from "react-i18next";

type LegendProps = {
    nodes: CustomNode[];
    links: CustomLink[];
    colorMap: ColorMap;
    variant: "outbreakAnalysis" | "dashboard" | "timeSpan";
};

export const Legend = ({ nodes, links, colorMap, variant }: LegendProps) => {
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [nodes]);
    const allClustersOfNodes = useMemo(() => getUniqueClustersOfNodes(nodes), [nodes, variant]);
    const registeredAtTimeStamps = useMemo(() => getRegisteredAtTimestamps(nodes), [nodes, variant]);
    const uniqueTypesOfLinks = useMemo(() => getUniqueTypesOfLinks(links), [links]);
    const { t } = useTranslation();

    const renderNodeItems = (nodes: CustomNode[]) => {
        return nodes.map((node) => (
            <div className="flex items-center gap-2" key={node.cluster}>
                <span
                    style={{
                        backgroundColor: `${
                            colorMap[node.cluster].isActive
                                ? colorMap[node.cluster].color
                                : COLOR_FOR_CASES_WITHOUT_OUTBREAKS
                        }`,
                    }}
                    className={"rounded-full h-3 w-3"}
                />
                <p className="text-xs">{node.cluster}</p>
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
        if (selectedOutbreak.length === 0 || selectedBackground.length === 0) return;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Ausgewählter Background</Label>
                {renderNodeItems(selectedBackground)}
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
                    <div className="flex flex-col">
                        <Label className="-ml-1 px-1 text-xs font-medium">Kontaktkanten</Label>
                        {renderLinkItems(contactTracingLinks)}
                    </div>
                )}
            </div>
        );
    };

    const renderOutbreakLegend = () => {
        if (selectedOutbreak.length === 0) return;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Ausgewählter Ausbruch</Label>
                {renderNodeItems(selectedOutbreak)}
            </div>
        );
    };

    if (!nodes || nodes.length === 0) return;

    const renderNodeLegend = () => {
        switch (variant) {
            case "dashboard":
                return <div className="flex flex-col">{renderNodeItems(allClustersOfNodes)}</div>;

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

    return (
        <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-3 bg-muted/80 pointer-events-none">
            <legend className="-ml-1 px-1 text-xs font-bold -mb-2">Legende</legend>
            {renderNodeLegend()}
            {renderLinkLegend()}
        </fieldset>
    );
};
