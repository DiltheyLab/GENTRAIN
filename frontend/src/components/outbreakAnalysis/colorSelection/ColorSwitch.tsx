import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "./ColorPicker";
import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "@/components/ui/label";

type ColorSwitchProps = {
    cluster: string;
};

export const ColorSwitch = ({ cluster }: ColorSwitchProps) => {
    const analysisStore = useAnalysisStore();
    const colorMap = analysisStore.graphSettings.colorMap;

    const changeColor = (cluster: string, newColor: string) => {
        colorMap[cluster] = newColor;
        analysisStore.updateGraphSettings({ colorMap: colorMap });
    };

    return (
        <div className="flex flex-row items-center gap-3" key={cluster}>
            <Switch id={cluster} defaultChecked={true} />
            <div className="flex justify-between w-full">
                <Label htmlFor={cluster} className="font-normal text-md">
                    {cluster}
                </Label>
                <ColorPicker nodeColor={colorMap[cluster]} cluster={cluster} changeColor={changeColor} />
            </div>
        </div>
    );
};
