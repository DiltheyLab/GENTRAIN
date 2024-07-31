import { useAnalysisStore } from "@/stores/analysis";
import { CustomNode } from "@/types/graph";
import { Label } from "../ui/label";

type LegendProps = {
    nodes: CustomNode[];
    isOutbreakSeparated?: boolean;
};

export const Legend = ({ nodes, isOutbreakSeparated = false }: LegendProps) => {
    const analyseStore = useAnalysisStore();

    const uniqueGroupsOfNodes = nodes
        .filter((group, index, self) => {
            return index === self.findIndex((node) => node.group === group.group);
        })
        .sort((a, b) => a.group.localeCompare(b.group));

    const renderLegendItems = (nodes: CustomNode[]) => {
        return nodes.map((node) => (
            <div className="flex items-center gap-2" key={node.group}>
                <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                <p>{node.group}</p>
            </div>
        ));
    };

    const renderBackgroundLegend = () => {
        const selectedOutbreak = analyseStore.settings.selectedOutbreak;
        const nodesFromBackground = uniqueGroupsOfNodes.filter((node) => node.group !== selectedOutbreak?.name);

        if (!selectedOutbreak || nodesFromBackground.length === 0) return;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-sm font-medium">Ausgewählter Background</Label>
                {renderLegendItems(nodesFromBackground)}
            </div>
        );
    };

    const renderOutbreakLegend = () => {
        const selectedOutbreak = analyseStore.settings.selectedOutbreak;
        const nodeFromSelectedOutbreak = uniqueGroupsOfNodes.find((node) => node.group === selectedOutbreak?.name);

        if (!selectedOutbreak || !nodeFromSelectedOutbreak) return;

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-sm font-medium">Ausgewählter Ausbruch</Label>
                {renderLegendItems([nodeFromSelectedOutbreak])}
            </div>
        );
    };

    if (!nodes || nodes.length === 0) return;

    return (
        <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-3 bg-muted">
            <legend className="-ml-1 px-1 text-sm font-bold -mb-2">Legende</legend>
            {isOutbreakSeparated ? (
                <div className="flex flex-col gap-2">
                    {renderOutbreakLegend()}
                    {renderBackgroundLegend()}
                </div>
            ) : (
                <div className="flex flex-col">{renderLegendItems(uniqueGroupsOfNodes)}</div>
            )}
        </fieldset>
    );
};
