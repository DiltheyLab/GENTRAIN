import { CustomNode } from "@/types/graph";

type LegendProps = {
    nodes: CustomNode[];
};

export const Legend = ({ nodes }: LegendProps) => {
    const uniqueGroups = nodes
        .filter((group, index, self) => {
            return index === self.findIndex((node) => node.group === group.group);
        })
        .sort((a, b) => a.group.localeCompare(b.group));

    const renderLegend = () =>
        uniqueGroups.map((node) => (
            <div className="flex items-center gap-2" key={node.group}>
                <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                <p>{node.group}</p>
            </div>
        ));

    if (!nodes || nodes.length === 0) return;

    return (
        <fieldset className="absolute z-10 left-2 top-2 rounded-lg w-fit border p-4 bg-muted">
            <legend className="-ml-1 px-1 text-sm font-medium">Legende</legend>
            <div className="flex flex-col">{renderLegend()}</div>
        </fieldset>
    );
};
