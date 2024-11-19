import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { getSelectedClusters } from "@/modules/core/helpers/graphs";
import { useMemo } from "react";
import { ColorSection } from "./ColorSection";
import { Label } from "@/modules/core/components/ui/Label";
import { ColoringMode } from "@/modules/core/types/graph";
import { RadioGroup, RadioGroupItem } from "@/modules/core/components/ui/RadioGroup";

export const ColorSelection = () => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore();
    const { selectedOutbreak, selectedBackground } = useMemo(
        () => getSelectedClusters(),
        [outbreakAnalysisStore.graphData]
    );

    const handleColoringChange = (value: ColoringMode) => {
        switch (value) {
            case "outbreaks":
                outbreakAnalysisStore.updateGraphSettings({ coloringMode: "outbreaks" });
                break;
            case "timeSpan":
                outbreakAnalysisStore.updateGraphSettings({ coloringMode: "timeSpan" });
                break;
        }
    };

    return (
        <div>
            <RadioGroup
                defaultValue={outbreakAnalysisStore.graphSettings.coloringMode}
                onValueChange={(value: ColoringMode) => handleColoringChange(value)}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="timeSpan" id="timeSpan" />
                    <Label htmlFor="timeSpan" className="text-md">
                        Nach Zeitspanne einfärben
                    </Label>
                </div>

                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outbreaks" id="outbreaks" />
                    <Label htmlFor="outbreaks" className="text-md">
                        Nach Ausbrüchen einfärben
                    </Label>
                </div>
            </RadioGroup>
            {outbreakAnalysisStore.graphSettings.coloringMode === "outbreaks" && (
                <div className="flex flex-col gap-3 mt-4">
                    <ColorSection label="Ausgewählten Ausbruch umfärben" clusters={selectedOutbreak} />
                    <ColorSection label="Ausbrüche in der Umgebung umfärben" clusters={selectedBackground} />
                </div>
            )}
        </div>
    );
};
