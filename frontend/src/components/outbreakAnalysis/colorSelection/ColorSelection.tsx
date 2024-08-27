import { AnalysisStore } from "@/stores/analysis";
import { getSelectedClusters } from "@/services/graphs";
import { useMemo } from "react";
import { ColorSection } from "./ColorSection";
import { Label } from "@/components/ui/label";
import { ColoringMode } from "@/types/graph";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DashboardGraphStore } from "@/stores/dashboardGraph";
import { Input } from "@/components/ui/input";

type ColorSelectionProps = {
    store: AnalysisStore | DashboardGraphStore;
    showClusters: boolean;
    showTimeSpan: boolean;
    showOutbreaks: boolean;
    allowChangingOutbreakColoring?: boolean;
};
export const ColorSelection = ({
    store,
    showTimeSpan,
    showOutbreaks,
    showClusters = false,
    allowChangingOutbreakColoring,
}: ColorSelectionProps) => {
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [store.graphData]);

    const handleColoringChange = (value: ColoringMode) => {
        switch (value) {
            case "clusters":
                store.updateGraphSettings({ coloringMode: "clusters" });
                break;
            case "outbreaks":
                store.updateGraphSettings({ coloringMode: "outbreaks" });
                break;
            case "timeSpan":
                store.updateGraphSettings({ coloringMode: "timeSpan" });
                break;
        }
    };

    const changeClusteringThreshold = (value: number) => {
        store.updateSettings({ clusteringThreshold: value });
    };

    return (
        <div>
            <RadioGroup
                defaultValue={store.graphSettings.coloringMode}
                onValueChange={(value: ColoringMode) => handleColoringChange(value)}
            >
                {showTimeSpan && (
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="timeSpan" id="timeSpan" />
                        <Label htmlFor="timeSpan" className="font-normal text-md">
                            Nach Zeitspanne einfärben
                        </Label>
                    </div>
                )}
                {showClusters && (
                    <>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clusters" id="clusters" />
                            <Label htmlFor="clusters" className="font-normal text-md">
                                Nach Clustern einfärben
                            </Label>
                        </div>
                        <div
                            className={`${store.graphSettings.coloringMode === "clusters" ? "block" : "hidden"} -mt-1`}
                        >
                            <Label htmlFor="geneticDistanceThreshold">Cluster Schwellenwert</Label>
                            <Input
                                type="number"
                                min={0}
                                id="clusteringThreshold"
                                value={store.settings.clusteringThreshold}
                                onChange={(e) => changeClusteringThreshold(+e.target.value)}
                            />
                        </div>
                    </>
                )}
                {showOutbreaks && (
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outbreaks" id="outbreaks" />
                        <Label htmlFor="outbreaks" className="font-normal text-md">
                            Nach Ausbrüchen einfärben
                        </Label>
                    </div>
                )}
            </RadioGroup>
            {store.graphSettings.coloringMode === "outbreaks" && allowChangingOutbreakColoring && (
                <div className="flex flex-col gap-3 mt-4">
                    <ColorSection label="Selektierten Ausbruch umfärben" nodes={selectedOutbreak} />
                    <ColorSection label="Background umfärben" nodes={selectedBackground} />
                </div>
            )}
        </div>
    );
};
