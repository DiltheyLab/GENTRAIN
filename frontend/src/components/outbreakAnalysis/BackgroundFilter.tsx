import { Label } from "../ui/label";
import { useAnalysisStore } from "@/stores/analysis";
import { DateRangePicker } from "./DateRangePicker";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

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
            <Label className="font-bold text-lg">3. Background filtern</Label>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="includeCasesWithLowGeneticDistance"
                    checked={analysisStore.settings.includeCasesWithLowGeneticDistance}
                    onCheckedChange={(value) => handleIncludeCasesWithLowGeneticDistance(value)}
                />
                <Label htmlFor="includeCasesWithLowGeneticDistance" className="font-normal text-md leading-5">
                    Nur zum Ausbruch verwandte Fälle anzeigen
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
