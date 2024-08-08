import { useAnalysisStore } from "@/stores/analysis";
import { CustomLink, CustomNode } from "@/types/graph";
import { Label } from "../ui/label";

type LegendProps = {
    nodes: CustomNode[];
    links: CustomLink[];
    isOutbreakSeparated?: boolean;
};

const getUniqueClustersOfNodes = (nodes: CustomNode[]) => {
    let uniqueClustersOfNodes = nodes
        .filter((cluster, index, self) => {
            return index === self.findIndex((node) => node.cluster === cluster.cluster);
        })
        .sort((a, b) => a.cluster.localeCompare(b.cluster));

    //find the index of the cluster "Keinem Ausbruch zugewiesen" and put it at the end of the array
    const index = uniqueClustersOfNodes.findIndex((node) => node.cluster === "Keinem Ausbruch zugewiesen");
    if (index !== -1) {
        const item = uniqueClustersOfNodes.splice(index, 1);
        uniqueClustersOfNodes.push(item[0]);
    }
    return uniqueClustersOfNodes;
};

const getUniqueTypesOfLinks = (links: CustomLink[]) => {
    return links
        .filter((link, index, self) => {
            return index === self.findIndex((l) => l.type === link.type);
        })
        .sort((a, b) => a.type.localeCompare(b.type));
};

export const Legend = ({ nodes, links, isOutbreakSeparated = false }: LegendProps) => {
    const analyseStore = useAnalysisStore();

    const uniqueClusterOfNodes = getUniqueClustersOfNodes(nodes);
    const uniqueTypesOfLinks = getUniqueTypesOfLinks(links);

    const renderNodeItems = (nodes: CustomNode[]) => {
        return nodes.map((node) => (
            <div className="flex items-center gap-2" key={node.cluster}>
                <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
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
        const selectedOutbreak = analyseStore.settings.selectedOutbreak;
        const nodesFromBackground = uniqueClusterOfNodes.filter((node) => node.cluster !== selectedOutbreak?.name);

        if (!selectedOutbreak || nodesFromBackground.length === 0) return;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Ausgewählter Background</Label>
                {renderNodeItems(nodesFromBackground)}
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
        const selectedOutbreak = analyseStore.settings.selectedOutbreak;
        const nodeFromSelectedOutbreak = uniqueClusterOfNodes.find((node) => node.cluster === selectedOutbreak?.name);

        if (!selectedOutbreak || !nodeFromSelectedOutbreak) return;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-xs font-medium">Ausgewählter Ausbruch</Label>
                {renderNodeItems([nodeFromSelectedOutbreak])}
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
                <div className="flex flex-col">{renderNodeItems(uniqueClusterOfNodes)}</div>
            )}
            <div className="flex flex-col mt-2">{links.length !== 0 && renderLinkLegend()}</div>
        </fieldset>
    );
};
