import { Label } from "@/modules/core/components/ui/Label";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { DateRangePicker } from "./DateRangePicker";
import { Switch } from "@/modules/core/components/ui/Switch";
import { Input } from "@/modules/core/components/ui/Input";

export const BackgroundFilter = () => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore();

    const handleExcludeCasesAboveGeneticDistanceThreshold = (value: boolean) => {
        outbreakAnalysisStore.updateSettings({ excludeCasesAboveGeneticDistanceThreshold: value });
    };

    const changeGeneticDistanceThreshold = (value: number) => {
        outbreakAnalysisStore.updateSettings({ geneticDistanceThreshold: value });
    };

    const handleExcludeCasesWithoutSequence = (value: boolean) => {
        outbreakAnalysisStore.updateSettings({ excludeCasesWithoutSequence: value });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="excludeCasesWithoutSequence"
                    checked={outbreakAnalysisStore.settings.excludeCasesWithoutSequence}
                    onCheckedChange={(value) => handleExcludeCasesWithoutSequence(value)}
                />
                <Label htmlFor="excludeCasesWithoutSequence" className="text-md leading-5">
                    Nicht sequenzierte Fälle ausschließen
                </Label>
            </div>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="excludeCasesAboveGeneticDistanceThreshold"
                    checked={outbreakAnalysisStore.settings.excludeCasesAboveGeneticDistanceThreshold}
                    onCheckedChange={(value) => handleExcludeCasesAboveGeneticDistanceThreshold(value)}
                />
                <Label htmlFor="excludeCasesAboveGeneticDistanceThreshold" className="text-md leading-5">
                    Sequenzierte Fälle mit genetischer Distanz &gt;{" "}
                    {outbreakAnalysisStore.settings.geneticDistanceThreshold} ausschließen
                </Label>
            </div>
            {outbreakAnalysisStore.settings.excludeCasesAboveGeneticDistanceThreshold && (
                <>
                    <Label htmlFor="geneticDistanceThreshold">Genetischer Distanzschwellenwert</Label>
                    <Input
                        type="number"
                        min={0}
                        id="geneticDistanceThreshold"
                        value={outbreakAnalysisStore.settings.geneticDistanceThreshold}
                        onChange={(e) => changeGeneticDistanceThreshold(+e.target.value)}
                    />
                </>
            )}
            <DateRangePicker />
        </div>
    );
};
