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

    const createOptions = (groupsAndOutbreaks: SelectedBackground | undefined) => {
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

    const createFilteredOptions = (groupsAndOutbreaks: SelectedBackground | undefined) => {
        const options = createOptions(groupsAndOutbreaks);
        const filteredOptions = options?.filter(
            (option) => option.value !== analysisStore.settings.selectedOutbreak?.name
        );
        return filteredOptions;
    };

    const handleIgnoreBackground = (value: boolean) => {
        analysisStore.updateSettings({ ignoreBackground: value });
    };

    const handleMultipleSelectChange = (values: Option[]) => {
        const selectedBackground = {
            outbreaks: [] as OutbreakSchema[],
            groups: [] as GroupSchema[],
        } satisfies SelectedBackground;
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

    const handleIncludeCasesWithoutOutbreak = (value: boolean) => {
        analysisStore.updateSettings({ includeCasesWithoutOutbreak: value });
    };

    const handleIncludeCasesWithLowGeneticDistance = (value: boolean) => {
        analysisStore.updateSettings({ includeCasesWithLowGeneticDistance: value });
    };

    return (
        <div className="flex flex-col gap-4">
            <Label className="font-bold text-lg">2. Background festlegen</Label>
            <MultipleSelector
                options={createFilteredOptions(groupsAndOutbreaks)} //initially get options from database so user can choose one of them
                value={createOptions(analysisStore.settings.selectedBackground || undefined)} //if options are set in store use them as preselected options
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
                    id="includeCasesWithoutOutbreak"
                    checked={analysisStore.settings.includeCasesWithoutOutbreak}
                    onCheckedChange={(value) => handleIncludeCasesWithoutOutbreak(value)}
                />
                <Label htmlFor="includeCasesWithoutOutbreak" className="font-normal text-base">
                    Daten verwenden, die keinem Ausbruch zugewiesen sind
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
            </div>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="includeCasesWithLowGeneticDistance"
                    checked={analysisStore.settings.ignoreBackground}
                    onCheckedChange={(value) => handleIncludeCasesWithLowGeneticDistance(value)}
                />
                <Label htmlFor="includeCasesWithLowGeneticDistance" className="font-normal text-base">
                    Daten verwenden die unter dem genetischen Distanzschwellenwert liegen
                </Label>
            </div>
        </div>
    );
};
