import { CustomNode } from "@/modules/core/types/graph";
import { ColorSwitch } from "./ColorSwitch";
import { Label } from "@/modules/core/components/ui/Label";

type ColorSectionProps = {
    nodes: CustomNode[];
    label: string;
};
export const ColorSection = ({ nodes, label }: ColorSectionProps) => {
    if (nodes.length === 0) return null;

    return (
        <>
            <Label>{label}</Label>
            {nodes.map((node) => (
                <ColorSwitch key={node.cluster} cluster={node.cluster} />
            ))}
        </>
    );
};
