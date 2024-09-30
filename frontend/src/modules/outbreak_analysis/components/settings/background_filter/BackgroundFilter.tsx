import { Label } from "@/modules/core/components/ui/Label";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { DateRangePicker } from "./DateRangePicker";
import { Switch } from "@/modules/core/components/ui/Switch";
import { Input } from "@/modules/core/components/ui/Input";

type BackgroundFilterProps = {
    disabled: boolean;
};

export const BackgroundFilter = ({ disabled }: BackgroundFilterProps) => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore();

    const handleExcludeCasesAboveGeneticDistanceThreshold = (value: boolean) => {
        outbreakAnalysisStore.updateAnalysisSettings({ excludeCasesAboveGeneticDistanceThreshold: value });
    };

    const changeGeneticDistanceThreshold = (value: number) => {
        outbreakAnalysisStore.updateAnalysisSettings({ geneticDistanceThreshold: value });
    };

    const handleExcludeCasesWithoutSequence = (value: boolean) => {
        outbreakAnalysisStore.updateAnalysisSettings({ excludeCasesWithoutSequence: value });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="excludeCasesWithoutSequence"
                    checked={outbreakAnalysisStore.analysisSettings.excludeCasesWithoutSequence}
                    onCheckedChange={(value) => handleExcludeCasesWithoutSequence(value)}
                    disabled={disabled}
                />
                <Label htmlFor="excludeCasesWithoutSequence" className="text-md leading-5">
                    Nicht sequenzierte Fälle ausschließen
                </Label>
            </div>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="excludeCasesAboveGeneticDistanceThreshold"
                    checked={outbreakAnalysisStore.analysisSettings.excludeCasesAboveGeneticDistanceThreshold}
                    onCheckedChange={(value) => handleExcludeCasesAboveGeneticDistanceThreshold(value)}
                    disabled={disabled}
                />
                <Label htmlFor="excludeCasesAboveGeneticDistanceThreshold" className="text-md leading-5">
                    Sequenzierte Fälle mit genetischer Distanz &gt;{" "}
                    {outbreakAnalysisStore.analysisSettings.geneticDistanceThreshold} ausschließen
                </Label>
            </div>
            {outbreakAnalysisStore.analysisSettings.excludeCasesAboveGeneticDistanceThreshold && (
                <>
                    <Label htmlFor="geneticDistanceThreshold">Genetischer Distanzschwellenwert</Label>
                    <Input
                        type="number"
                        min={0}
                        id="geneticDistanceThreshold"
                        value={outbreakAnalysisStore.analysisSettings.geneticDistanceThreshold}
                        onChange={(e) => changeGeneticDistanceThreshold(+e.target.value)}
                    />
                </>
            )}
            <DateRangePicker disabled={disabled} />
        </div>
    );
};
