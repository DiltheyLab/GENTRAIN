import { useAnalysisStore } from "@/stores/analysis";
import { CustomNode } from "@/types/graph";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

type LegendProps = {
    nodes: CustomNode[];
};

export const Legend = ({ nodes }: LegendProps) => {
    const analyseStore = useAnalysisStore();

    const uniqueGroupsOfNodes = nodes
        .filter((group, index, self) => {
            return index === self.findIndex((node) => node.group === group.group);
        })
        .sort((a, b) => a.group.localeCompare(b.group));

    const renderBackgroundLegend = () => {
        const selectedOutbreak = analyseStore.settings.selectedOutbreak;
        const nodesFromBackground = uniqueGroupsOfNodes.filter((node) => node.group !== selectedOutbreak?.name);

        if (!selectedOutbreak || nodesFromBackground.length === 0) return;

        const backgroundLegend = nodesFromBackground.map((node) => (
            <div className="flex items-center gap-2" key={node.group}>
                <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                <p>{node.group}</p>
            </div>
        ));

        return (
            <div className="flex flex-col">
                <Label className="-ml-1 px-1 text-sm font-medium">Ausgewählter Background</Label>
                {backgroundLegend}
            </div>
        );
    };

    const renderOutbreakLegend = () => {
        const selectedOutbreak = analyseStore.settings.selectedOutbreak;
        const nodeFromSelectedOutbreak = uniqueGroupsOfNodes.find((node) => node.group === selectedOutbreak?.name);

        if (!selectedOutbreak || !nodeFromSelectedOutbreak) return;

        return (
            <div className="flex items-center gap-2">
                <span
                    style={{ backgroundColor: `${nodeFromSelectedOutbreak.color}` }}
                    className={"rounded-full h-3 w-3"}
                />
                <p>{selectedOutbreak?.name}</p>
            </div>
        );
    };

    if (!nodes || nodes.length === 0) return;

    return (
        <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-3 bg-muted">
            <legend className="-ml-1 px-1 text-sm font-bold -mb-2">Legende</legend>
            <div className="flex flex-col gap-2">
                <div>
                    <Label className="-ml-1 px-1 text-sm font-medium">Ausgewählter Ausbruch</Label>
                    <div className="flex flex-col">{renderOutbreakLegend()}</div>
                </div>
                <div>{renderBackgroundLegend()}</div>
            </div>
        </fieldset>
    );
};
