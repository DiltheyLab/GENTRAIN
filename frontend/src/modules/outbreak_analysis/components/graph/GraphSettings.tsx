import { Button } from "@/modules/core/components/ui/Button";
import { Settings, X } from "lucide-react";
import { Label } from "@/modules/core/components/ui/Label";
import { Slider } from "@/modules/core/components/ui/Slider";
import { Switch } from "@/modules/core/components/ui/Switch";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";

type GraphSettingsProps = {
    showGraphSettings: boolean;
    updateShowGraphSettings: (showGraphSettings: boolean) => void;
};

export const GraphSettings = ({ showGraphSettings, updateShowGraphSettings }: GraphSettingsProps) => {
    const analyseStore = useOutbreakAnalysisStore();

    if (!showGraphSettings) {
        return (
            <Button
                className="absolute z-10 right-2 top-0 hover:bg-inherit hover:text-primary rounded-full px-1 text-slate-700"
                type="button"
                variant="ghost"
                onClick={() => updateShowGraphSettings(true)}
                title="Grapheinstellungen"
            >
                <Settings />
            </Button>
        );
    }

    return (
        <fieldset className="absolute z-10 right-2 top-2 rounded-lg w-fit border p-4 bg-muted/80 pointer-events-none ">
            <legend className="-ml-1 px-1 text-sm font-medium">Grapheinstellungen</legend>
            <Button
                className="absolute -top-[17px] right-1 hover:bg-inherit hover:text-primary bg-inherit rounded-full h-4 -px-1 pointer-events-auto"
                type="button"
                size="sm"
                variant={"ghost"}
                onClick={() => updateShowGraphSettings(false)}
            >
                <X size={23} className="text-slate-700" />
            </Button>
            <div className="flex flex-col gap-3 pointer-events-auto">
                <div className="flex items-center space-x-3">
                    <label htmlFor="nodeLabel" className="text-sm font-normal leading-none">
                        Knotenbeschreibung
                    </label>
                    <Switch
                        id="nodeLabel"
                        isSmall={true}
                        checked={analyseStore.graphSettings.showNodeLabel}
                        onCheckedChange={(value) => analyseStore.updateGraphSettings({ showNodeLabel: value })}
                    />
                </div>
                <div className="flex space-x-3 items-baseline">
                    <Label htmlFor="forceLinkDistance" className="text-sm font-normal leading-none">
                        Kantenabstand
                    </Label>
                    <Slider
                        id="forceLinkDistance"
                        sliderColorIsGrey={true}
                        className="w-1/2"
                        defaultValue={[analyseStore.graphSettings.linkDistance]}
                        max={130}
                        min={10}
                        step={10}
                        onValueChange={(value) => analyseStore.updateGraphSettings({ linkDistance: value[0] })}
                    />
                </div>
            </div>
        </fieldset>
    );
};
