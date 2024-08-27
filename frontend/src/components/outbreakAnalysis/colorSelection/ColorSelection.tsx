import { useAnalysisStore } from "@/stores/analysis";
import { getSelectedClusters } from "@/services/graphs";
import { useMemo } from "react";
import { ColorSection } from "./ColorSection";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const ColorSelection = () => {
    const analysisStore = useAnalysisStore();
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [analysisStore.graphData]);

    const handleColorChangeByTimeSpan = (isColoredByTimeSpan: boolean) => {
        analysisStore.updateGraphSettings({ isColoredByTimeSpan: isColoredByTimeSpan });
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <Label>Nach Zeitspanne einfärben</Label>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="registeredAtTimeSpan"
                    checked={analysisStore.graphSettings.isColoredByTimeSpan}
                    onCheckedChange={(isChecked) => handleColorChangeByTimeSpan(isChecked)}
                />
                <Label htmlFor="registeredAtTimeSpan" className="font-normal text-md">
                    Registrierungsdatum
                </Label>
            </div>
            {!analysisStore.graphSettings.isColoredByTimeSpan && (
                <>
                    <ColorSection label="Selektierten Ausbruch umfärben" nodes={selectedOutbreak} />
                    <ColorSection label="Background umfärben" nodes={selectedBackground} />
                </>
            )}
        </div>
    );
};
