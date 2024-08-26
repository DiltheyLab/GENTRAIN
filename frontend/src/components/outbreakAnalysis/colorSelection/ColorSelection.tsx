import { useAnalysisStore } from "@/stores/analysis";
import { getSelectedClusters } from "@/services/graphs";
import { useMemo } from "react";
import { ColorSection } from "./ColorSection";
import { Label } from "@/components/ui/label";
import { ColoringMode } from "@/types/graph";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const ColorSelection = () => {
    const analysisStore = useAnalysisStore();
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [analysisStore.graphData]);

    const handleColoringChange = (value: ColoringMode) => {
        switch (value) {
            case "outbreaks":
                analysisStore.updateGraphSettings({ coloringMode: "outbreaks" });
                break;
            case "timeSpan":
                analysisStore.updateGraphSettings({ coloringMode: "timeSpan" });
                break;
        }
    };

    return (
        <div>
            <RadioGroup
                defaultValue={analysisStore.graphSettings.coloringMode}
                onValueChange={(value: ColoringMode) => handleColoringChange(value)}
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="timeSpan" id="timeSpan" />
                    <Label htmlFor="timeSpan" className="font-normal text-md">
                        Nach Zeitspanne einfärben
                    </Label>
                </div>

                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outbreaks" id="outbreaks" />
                    <Label htmlFor="outbreaks" className="font-normal text-md">
                        Nach Ausbrüchen einfärben
                    </Label>
                </div>
            </RadioGroup>
            {analysisStore.graphSettings.coloringMode === "outbreaks" && (
                <div className="flex flex-col gap-3 mt-4">
                    <ColorSection label="Selektierten Ausbruch umfärben" nodes={selectedOutbreak} />
                    <ColorSection label="Background umfärben" nodes={selectedBackground} />
                </div>
            )}
        </div>
    );
};
