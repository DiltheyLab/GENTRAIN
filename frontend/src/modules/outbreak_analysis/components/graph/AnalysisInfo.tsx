import { Label } from "@/modules/core/components/ui/Label";
import { Switch } from "@/modules/core/components/ui/Switch";

type AnalysisInfoProps = {
    name: string | null;
    autoSave: boolean;
    onAutoSaveChange: (value: boolean) => void;
};

export const AnalysisInfo = ({ name, autoSave, onAutoSaveChange }: AnalysisInfoProps) => {
    return (
        <fieldset className="absolute z-10 left-2 bottom-2 rounded-lg w-fit border px-2 py-1 bg-muted/80">
            <div className="flex flex-col">
                <small className=" text-sm font-medium">Analyse: {name}</small>
                <div className="flex items-center gap-2">
                    <Label htmlFor="autoSave">Autom. Speichern</Label>
                    <Switch id="autoSave" isSmall={true} checked={autoSave} onCheckedChange={onAutoSaveChange} />
                </div>
            </div>
        </fieldset>
    );
};
