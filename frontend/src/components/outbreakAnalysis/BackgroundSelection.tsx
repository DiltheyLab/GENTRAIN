import { Label } from "../ui/label";
import MultipleSelector, { Option } from "../ui/multiSelect";
import { Switch } from "../ui/switch";
import { SelectedBackground, useAnalysisStore } from "@/stores/analysis";
import { useGetAllGroupsAndOutbreaks } from "@/hooks/database/groups/useGetAllGroups";
import { OutbreakSchema } from "@/database/outbreak";
import { GroupSchema } from "@/database/groups";

export const BackgroundSelection = () => {
    const groupsAndOutbreaks = useGetAllGroupsAndOutbreaks();
    const analysisStore = useAnalysisStore();

    const getOptions = () => {
        if (!groupsAndOutbreaks) return;
        const options: Option[] = [];
        for (const outbreak of groupsAndOutbreaks?.outbreaks) {
            options.push({
                label: outbreak.name,
                value: outbreak.name,
                id: outbreak.id.toString(),
                group: "Ausbrüche",
            });
        }
        for (const group of groupsAndOutbreaks?.groups) {
            options.push({
                label: group.name,
                value: group.name,
                id: group.id.toString(),
                category_id: group.category_id.toString(),
                group: "Andere Gruppen",
            });
        }
        return options;
    };

    const handleIgnoreBackground = (value: boolean) => {
        analysisStore.updateSettings({ ignoreBackground: value });
    };

    const handleMultipleSelectChange = (values: Option[]) => {
        const selectedBackground = {
            outbreaks: [] as OutbreakSchema[],
            groups: [] as GroupSchema[],
        };
        for (const value of values) {
            if (value.group === "Ausbrüche") {
                const outbreak = {
                    id: +value.id,
                    name: value.value,
                } satisfies OutbreakSchema;
                selectedBackground.outbreaks.push(outbreak);
            } else {
                const group = {
                    id: +value.id,
                    name: value.value,
                    category_id: +value.category_id!,
                } satisfies GroupSchema;
                selectedBackground.groups.push(group);
            }
        }
        analysisStore.updateSettings({ selectedBackground: selectedBackground });
    };

    const getMultipleSelectValueFromStore = () => {
        //convert store selected Background in options
    };

    return (
        <div className="flex flex-col gap-4">
            <Label className="font-bold text-lg">2. Background festlegen</Label>
            <MultipleSelector
                options={getOptions()}
                onChange={(value) => handleMultipleSelectChange(value)}
                placeholder="Bitte auswählen"
                emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        Keine Gruppen gefunden
                    </p>
                }
                groupBy="group"
            />
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="ignoreBackground"
                    checked={analysisStore.settings.ignoreBackground}
                    onCheckedChange={(values) => handleIgnoreBackground(values)}
                />
                <Label htmlFor="ignoreBackground" className="font-normal text-base">
                    Alle Daten als Background verwenden
                </Label>
            </div>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="ignoreBackground"
                    checked={analysisStore.settings.ignoreBackground}
                    onCheckedChange={(value) => handleIgnoreBackground(value)}
                />
                <Label htmlFor="ignoreBackground" className="font-normal text-base">
                    Background ausblenden
                </Label>
                <p>{JSON.stringify(analysisStore.settings.selectedBackground)}</p>
            </div>
        </div>
    );
};
