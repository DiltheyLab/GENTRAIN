import { Label } from "@/core/components/ui/Label";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { DateRangePicker } from "./DateRangePicker";
import { Switch } from "@/core/components/ui/Switch";
import { Input } from "@/core/components/ui/Input";

export const BackgroundFilter = () => {
    const analysisStore = useOutbreakAnalysisStore();

    const handleShowBackground = (value: boolean) => {
        analysisStore.updateSettings({ showBackground: value });
    };

    const handleExcludeCasesAboveGeneticDistanceThreshold = (value: boolean) => {
        analysisStore.updateSettings({ excludeCasesAboveGeneticDistanceThreshold: value });
    };

    const changeGeneticDistanceThreshold = (value: number) => {
        analysisStore.updateSettings({ geneticDistanceThreshold: value });
    };

    const handleExcludeCasesWithoutSequence = (value: boolean) => {
        analysisStore.updateSettings({ excludeCasesWithoutSequence: value });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="excludeCasesWithoutSequence"
                    checked={analysisStore.settings.excludeCasesWithoutSequence}
                    onCheckedChange={(value) => handleExcludeCasesWithoutSequence(value)}
                />
                <Label htmlFor="excludeCasesWithoutSequence" className="font-normal text-md leading-5">
                    Nicht sequenzierte Fälle ausschließen
                </Label>
            </div>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="excludeCasesAboveGeneticDistanceThreshold"
                    checked={analysisStore.settings.excludeCasesAboveGeneticDistanceThreshold}
                    onCheckedChange={(value) => handleExcludeCasesAboveGeneticDistanceThreshold(value)}
                />
                <Label htmlFor="excludeCasesAboveGeneticDistanceThreshold" className="font-normal text-md leading-5">
                    Sequenzierte Fälle mit genetischer Distanz &gt; {analysisStore.settings.geneticDistanceThreshold}{" "}
                    ausschließen
                </Label>
            </div>
            {analysisStore.settings.excludeCasesAboveGeneticDistanceThreshold && (
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
