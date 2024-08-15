import { useAnalysisStore } from "@/stores/analysis";
import { ColorMap, CustomLink, CustomNode } from "@/types/graph";
import { Label } from "../ui/label";
import { getSelectedClusters, getUniqueClustersOfNodes, getUniqueTypesOfLinks } from "@/services/graphs";
import { useMemo } from "react";

type LegendProps = {
    nodes: CustomNode[];
    links: CustomLink[];
    colorMap: ColorMap;
    isOutbreakSeparated?: boolean;
};

export const Legend = ({ nodes, links, colorMap, isOutbreakSeparated = false }: LegendProps) => {
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [nodes]);
    const allClustersOfNodes = useMemo(() => getUniqueClustersOfNodes(nodes), [nodes]);
    const uniqueTypesOfLinks = useMemo(() => getUniqueTypesOfLinks(links), [links]);

    const renderNodeItems = (nodes: CustomNode[]) => {
        return nodes.map((node) => (
            <div className="flex items-center gap-2" key={node.cluster}>
                <span style={{ backgroundColor: `${colorMap[node.cluster]}` }} className={"rounded-full h-3 w-3"} />
                <p className="text-xs">{node.cluster}</p>
            </div>
        ));
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
        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Kanten</Label>
                {renderLinkItems(uniqueTypesOfLinks)}
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

    return (
        <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-3 bg-muted/80 pointer-events-none">
            <legend className="-ml-1 px-1 text-xs font-bold -mb-2">Legende</legend>
            {isOutbreakSeparated ? (
                <div className="flex flex-col gap-2">
                    {renderOutbreakLegend()}
                    {renderBackgroundLegend()}
                </div>
            ) : (
                <div className="flex flex-col">{renderNodeItems(allClustersOfNodes)}</div>
            )}
            <div className="flex flex-col mt-2">{links.length !== 0 && renderLinkLegend()}</div>
        </fieldset>
    );
};
