import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "./ColorPicker";
import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "@/components/ui/label";

type ColorSwitchProps = {
    cluster: string;
};

export const ColorSwitch = ({ cluster }: ColorSwitchProps) => {
    const analysisStore = useAnalysisStore();
    const colorMap = { ...analysisStore.graphSettings.colorMap };

    const changeColor = (cluster: string, newColor: string) => {
        colorMap[cluster].color = newColor;
        analysisStore.updateGraphSettings({ colorMap: colorMap });
    };

    const handleColorSwitchChanged = (isChecked: boolean, cluster: string) => {
        colorMap[cluster].isActive = isChecked;
        analysisStore.updateGraphSettings({ colorMap: colorMap });
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
