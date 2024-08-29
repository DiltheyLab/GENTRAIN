import { Switch } from "@/modules/core/components/ui/Switch";
import { ColorPicker } from "./ColorPicker";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { Label } from "@/modules/core/components/ui/Label";

type ColorSwitchProps = {
    cluster: string;
};

export const ColorSwitch = ({ cluster }: ColorSwitchProps) => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore();
    const colorMap = { ...outbreakAnalysisStore.graphSettings.colorMap };

    const changeColor = (cluster: string, newColor: string) => {
        colorMap[cluster].color = newColor;
        outbreakAnalysisStore.updateGraphSettings({ colorMap: colorMap });
    };

    const handleColorSwitchChanged = (isChecked: boolean, cluster: string) => {
        colorMap[cluster].isActive = isChecked;
        outbreakAnalysisStore.updateGraphSettings({ colorMap: colorMap });
    };

    return (
        <div className="flex flex-row items-center gap-3" key={cluster}>
            <Switch
                id={cluster}
                checked={colorMap[cluster]?.isActive}
                onCheckedChange={(isChecked) => handleColorSwitchChanged(isChecked, cluster)}
            />
            <div className="flex justify-between w-full">
                <Label htmlFor={cluster} className="font-normal text-md">
                    {cluster}
                </Label>
                <ColorPicker
                    color={colorMap[cluster]?.color}
                    disabled={!colorMap[cluster]?.isActive}
                    cluster={cluster}
                    changeColor={changeColor}
                />
            </div>
        </div>
    );
};
