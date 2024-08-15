import { CustomNode } from "@/types/graph";
import { Label } from "../ui/label";
import { ColorSwitch } from "./ColorSwitch";

type ColorSectionProps = {
    nodes: CustomNode[];
    label: string;
};
export const ColorSection = ({ nodes, label }: ColorSectionProps) => {
    if (nodes.length === 0) return;

    return (
        <>
            <Label>{label}</Label>
            {nodes.map((node) => (
                <ColorSwitch key={node.cluster} cluster={node.cluster} />
            ))}
        </>
    );
};
