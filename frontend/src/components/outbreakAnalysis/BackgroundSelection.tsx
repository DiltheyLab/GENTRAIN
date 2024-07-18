import { Label } from "../ui/label";
import MultipleSelector, { Option } from "../ui/multiSelect";
import { Switch } from "../ui/switch";
import { useAnalysisStore } from "@/stores/analysis";
import { useGetAllGroupsAndOutbreaks } from "@/hooks/database/groups/useGetAllGroups";

export const BackgroundSelection = () => {
    const groupsAndOutbreaks = useGetAllGroupsAndOutbreaks();
    const analysisStore = useAnalysisStore();

    const getOptions = () => {
        if (!groupsAndOutbreaks) return;
        const options: Option[] = [];
        for (const outbreak of groupsAndOutbreaks?.outbreaks) {
            options.push({ label: outbreak.name, value: outbreak.name });
        }
        for (const group of groupsAndOutbreaks?.groups) {
            options.push({ label: group.name, value: group.name });
        }
        return options;
    };

    const handleIgnoreBackground = (value: boolean) => {
        analysisStore.updateSettings({ ignoreBackground: value });
    };

    return (
        <div className="flex flex-col gap-4">
            <Label className="font-bold text-lg">2. Background festlegen</Label>
            <MultipleSelector
                options={getOptions()}
                placeholder="Bitte auswählen"
                emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        Keine Gruppen gefunden
                    </p>
                }
            />
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="ignoreBackground"
                    checked={analysisStore.settings.ignoreBackground}
                    onCheckedChange={(value) => handleIgnoreBackground(value)}
                />
                <Label htmlFor="ignoreBackground" className="font-normal text-base">
                    Background ausblenden
                </Label>
            </div>
        </div>
    );
};
