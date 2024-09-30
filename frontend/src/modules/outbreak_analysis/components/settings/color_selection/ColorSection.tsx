import { ColorSwitch } from "./ColorSwitch";
import { Label } from "@/modules/core/components/ui/Label";

type ColorSectionProps = {
    clusters: string[];
    label: string;
};
export const ColorSection = ({ clusters, label }: ColorSectionProps) => {
    if (clusters.length === 0) return null;

    return (
        <>
            <Label className="font-normal">{label}</Label>
            {clusters.map((cluster) => (
                <ColorSwitch key={cluster} cluster={cluster} />
            ))}
        </>
    );
};
