import { Label } from "../ui/label";
import MultipleSelector, { Option } from "../ui/multiSelect";
import { SelectedBackground, useAnalysisStore } from "@/stores/analysis";
import { GroupWithCategory, useGetAllGroupsAndOutbreaks } from "@/hooks/database/groups/useGetAllGroups";
import { OutbreakSchema } from "@/database/outbreak";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

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
        if (groupsAndOutbreaks.casesWithoutOutbreakExist) {
            options.push({
                label: "Keinem Ausbruch zugewiesen",
                value: "Keinem Ausbruch zugewiesen",
                id: "0",
                group: "Ausbrüche",
            });
        }
        for (const group of groupsAndOutbreaks?.groupsWithCategories) {
            options.push({
                label: group.name,
                value: group.name,
                id: group.id.toString(),
                category_id: group.category_id.toString(),
                categoryName: group.categoryName,
                group: group.categoryName || "Andere Gruppen",
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

    const handleMultipleSelectChange = (values: Option[]) => {
        const selectedBackground: SelectedBackground = {
            outbreaks: [] as OutbreakSchema[],
            groupsWithCategories: [] as GroupWithCategory[],
            casesWithoutOutbreakExist: false,
        };
        for (const value of values) {
            if (value.group === "Ausbrüche" && value.label !== "Keinem Ausbruch zugewiesen") {
                const outbreak = {
                    id: +value.id,
                    name: value.value,
                } satisfies OutbreakSchema;
                selectedBackground.outbreaks.push(outbreak);
            } else if (value.group === "Ausbrüche" && value.label === "Keinem Ausbruch zugewiesen") {
                selectedBackground.casesWithoutOutbreakExist = true;
            } else {
                const group = {
                    id: +value.id,
                    name: value.value,
                    category_id: +value.category_id!,
                    categoryName: value.categoryName,
                } satisfies GroupWithCategory;
                selectedBackground.groupsWithCategories.push(group);
            }
        }
        analysisStore.updateSettings({ selectedBackground: selectedBackground });
    };

    const handleBackgroundDataChange = (value: "specificBackgroundData" | "allBackgroundData") => {
        if (value === "allBackgroundData") {
            analysisStore.updateSettings({ includeAllCases: true });
        } else {
            analysisStore.updateSettings({ includeAllCases: false });
        }
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <Label className="font-bold text-lg">2. Background auswählen</Label>
            <RadioGroup
                defaultValue={analysisStore.settings.includeAllCases ? "allBackgroundData" : "specificBackgroundData"}
                onValueChange={(value: "specificBackgroundData" | "allBackgroundData") =>
                    handleBackgroundDataChange(value)
                }
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="allBackgroundData" id="allBackgroundData" />
                    <Label htmlFor="allBackgroundData" className="font-normal text-md">
                        Alle Fälle verwenden
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specificBackgroundData" id="specificBackgroundData" />
                    <Label htmlFor="specificBackgroundData" className="font-normal text-md">
                        Fälle auswählen
                    </Label>
                </div>
            </RadioGroup>
            {!analysisStore.settings.includeAllCases && (
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
            )}
        </div>
    );
};
