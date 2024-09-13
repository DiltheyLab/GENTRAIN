import { Label } from "@/modules/core/components/ui/Label";
import { ColoringMode } from "@/modules/core/types/graph";
import { RadioGroup, RadioGroupItem } from "@/modules/core/components/ui/RadioGroup";
import { Input } from "@/modules/core/components/ui/Input";
import { useDashboardStore } from "@/modules/dashboard/stores/dashboard";

export const ColorSelection = () => {
    const updateGraphSettings = useDashboardStore((state) => state.updateGraphSettings);
    const updateSettings = useDashboardStore((state) => state.updateSettings);
    const coloringMode = useDashboardStore((state) => state.graphSettings.coloringMode);
    const clusteringThreshold = useDashboardStore((state) => state.settings.clusteringThreshold);

    const handleColoringChange = (value: ColoringMode) => {
        switch (value) {
            case "clusters":
                updateGraphSettings({ coloringMode: "clusters" });
                break;
            case "outbreaks":
                updateGraphSettings({ coloringMode: "outbreaks" });
                break;
            case "timeSpan":
                updateGraphSettings({ coloringMode: "timeSpan" });
                break;
        }
    };

    return (
        <div>
            <RadioGroup
                defaultValue={coloringMode}
                onValueChange={(value: ColoringMode) => handleColoringChange(value)}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outbreaks" id="outbreaks" />
                    <Label htmlFor="outbreaks" className="font-normal text-md">
                        Nach Ausbrüchen einfärben
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="timeSpan" id="timeSpan" />
                    <Label htmlFor="timeSpan" className="font-normal text-md">
                        Nach Zeitspanne einfärben
                    </Label>
                </div>
                <>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="clusters" id="clusters" />
                        <Label htmlFor="clusters" className="font-normal text-md">
                            Nach Clustern einfärben
                        </Label>
                    </div>
                    <div className={`${coloringMode === "clusters" ? "block" : "hidden"} -mt-1`}>
                        <Label htmlFor="geneticDistanceThreshold">Cluster Schwellenwert</Label>
                        <Input
                            type="number"
                            min={0}
                            id="clusteringThreshold"
                            value={clusteringThreshold}
                            onChange={(e) => updateSettings({ clusteringThreshold: +e.target.value })}
                        />
                    </div>
                </>
            </RadioGroup>
        </div>
    );
};
