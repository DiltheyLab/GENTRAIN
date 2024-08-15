import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { getSelectedClusters } from "@/services/graphs";
import { useMemo } from "react";
import { ColorSection } from "./ColorSection";

export const ColorSelection = () => {
    const analysisStore = useAnalysisStore();
    const { selectedOutbreak, selectedBackground } = useMemo(() => getSelectedClusters(), [analysisStore.graphData]);

    return (
        <div className="flex flex-col gap-4 mt-2">
            <ColorSection label="Selektierter Ausbruch umfärben" nodes={selectedOutbreak} />
            <ColorSection label="Background umfärben" nodes={selectedBackground} />

            <Label>Nach Zeitspanne umfärben</Label>
            <div className="flex flex-row items-center gap-3">
                <Switch id="showBackground" />
                <Label htmlFor="showBackground" className="font-normal text-md">
                    Registrierungsdatum
                </Label>
            </div>
        </div>
    );
};
