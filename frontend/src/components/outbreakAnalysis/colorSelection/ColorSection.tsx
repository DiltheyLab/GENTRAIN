import { CustomNode } from "@/types/graph";
import { ColorSwitch } from "./ColorSwitch";
import { Label } from "@/components/ui/label";

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
