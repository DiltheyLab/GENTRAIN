import { Label } from "@/components/ui/label";
import { ColoringMode } from "@/types/graph";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useDashboardStore } from "@/stores/dashboard";

export const ColorSelection = () => {
    const dashboardStore = useDashboardStore();

    const handleColoringChange = (value: ColoringMode) => {
        switch (value) {
            case "clusters":
                dashboardStore.updateGraphSettings({ coloringMode: "clusters" });
                break;
            case "outbreaks":
                dashboardStore.updateGraphSettings({ coloringMode: "outbreaks" });
                break;
            case "timeSpan":
                dashboardStore.updateGraphSettings({ coloringMode: "timeSpan" });
                break;
        }
    };

    const changeClusteringThreshold = (value: number) => {
        dashboardStore.updateSettings({ clusteringThreshold: value });
    };

    return (
        <div>
            <RadioGroup
                defaultValue={dashboardStore.graphSettings.coloringMode}
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
                    <div
                        className={`${
                            dashboardStore.graphSettings.coloringMode === "clusters" ? "block" : "hidden"
                        } -mt-1`}
                    >
                        <Label htmlFor="geneticDistanceThreshold">Cluster Schwellenwert</Label>
                        <Input
                            type="number"
                            min={0}
                            id="clusteringThreshold"
                            value={dashboardStore.settings.clusteringThreshold}
                            onChange={(e) => changeClusteringThreshold(+e.target.value)}
                        />
                    </div>
                </>
            </RadioGroup>
        </div>
    );
};
