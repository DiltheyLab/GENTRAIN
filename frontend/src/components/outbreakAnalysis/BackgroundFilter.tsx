import { Label } from "../ui/label";
import { useAnalysisStore } from "@/stores/analysis";
import { DateRangePicker } from "./DateRangePicker";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { CustomTooltip } from "../ui/customTooltip";
import { Info } from "lucide-react";
import { StepIndicator } from "../ui/step-indicator";

export const BackgroundFilter = () => {
    const analysisStore = useAnalysisStore();

    const handleShowBackground = (value: boolean) => {
        analysisStore.updateSettings({ showBackground: value });
    };

    const handleIncludeCasesWithLowGeneticDistance = (value: boolean) => {
        analysisStore.updateSettings({ includeCasesWithLowGeneticDistance: value });
    };

    const changeGeneticDistanceThreshold = (value: number) => {
        analysisStore.updateSettings({ geneticDistanceThreshold: value });
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
                <Label className="flex items-center font-bold text-md mr-3">
                    <StepIndicator>3</StepIndicator> Background filtern
                </Label>
                <CustomTooltip
                    trigger={<Info className="h-5 w-5 cursor-pointer" />}
                    content={
                        <p>
                            Sie können die in Schritt 2 ausgewählten Falldaten (Background) nach genetisch verwandten
                            Fällen oder einer Zeitspanne filtern.
                        </p>
                    }
                />
            </div>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="includeCasesWithLowGeneticDistance"
                    checked={analysisStore.settings.includeCasesWithLowGeneticDistance}
                    onCheckedChange={(value) => handleIncludeCasesWithLowGeneticDistance(value)}
                />
                <Label htmlFor="includeCasesWithLowGeneticDistance" className="font-normal text-md leading-5">
                    Nur zum Ausbruch genetisch verwandte Falldaten anzeigen
                </Label>
            </div>
            {analysisStore.settings.includeCasesWithLowGeneticDistance && (
                <>
                    <Label htmlFor="geneticDistanceThreshold">Genetischer Distanzschwellenwert</Label>
                    <Input
                        type="number"
                        min={0}
                        id="geneticDistanceThreshold"
                        value={analysisStore.settings.geneticDistanceThreshold}
                        onChange={(e) => changeGeneticDistanceThreshold(+e.target.value)}
                    />
                </>
            )}
            <DateRangePicker />
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="showBackground"
                    checked={analysisStore.settings.showBackground}
                    onCheckedChange={(value) => handleShowBackground(value)}
                />
                <Label htmlFor="showBackground" className="font-normal text-md">
                    Background anzeigen
                </Label>
            </div>
        </div>
    );
};
