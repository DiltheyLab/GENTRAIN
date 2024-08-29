import { Label } from "@/modules/core/components/ui/Label";
import MultipleSelector, { Option } from "@/modules/core/components/ui/MultiSelect";
import { SelectedBackground, useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { RadioGroup, RadioGroupItem } from "@/modules/core/components/ui/RadioGroup";
import { useGetAllGroupsAndOutbreaksForActivePathogen } from "@/modules/core/hooks/database/groups/useGetGroupsAndOutbreaksByActivePathogen";
import { useTranslation } from "react-i18next";
import { GroupWithCategory } from "@/modules/core/models/groups";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";

export const BackgroundSelection = () => {
    const groupsAndOutbreaks = useGetAllGroupsAndOutbreaksForActivePathogen();
    const outbreakAnalysisStore = useOutbreakAnalysisStore();
    const { t } = useTranslation();

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
                label: t("clusterTypes.noOutbreakAssigned"),
                value: t("clusterTypes.noOutbreakAssigned"),
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
            (option) => option.value !== outbreakAnalysisStore.settings.selectedOutbreak?.name
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
            if (value.group === "Ausbrüche" && value.label !== t("clusterTypes.noOutbreakAssigned")) {
                const outbreak = {
                    id: +value.id,
                    name: value.value,
                } satisfies OutbreakSchema;
                selectedBackground.outbreaks.push(outbreak);
            } else if (value.group === "Ausbrüche" && value.label === t("clusterTypes.noOutbreakAssigned")) {
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
        outbreakAnalysisStore.updateSettings({ selectedBackground: selectedBackground });
    };

    const handleBackgroundDataChange = (value: "specificBackgroundData" | "allBackgroundData") => {
        if (value === "allBackgroundData") {
            outbreakAnalysisStore.updateSettings({ includeAllCases: true });
        } else {
            outbreakAnalysisStore.updateSettings({ includeAllCases: false });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <RadioGroup
                defaultValue={
                    outbreakAnalysisStore.settings.includeAllCases ? "allBackgroundData" : "specificBackgroundData"
                }
                onValueChange={(value: "specificBackgroundData" | "allBackgroundData") =>
                    handleBackgroundDataChange(value)
                }
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="allBackgroundData" id="allBackgroundData" />
                    <Label htmlFor="allBackgroundData" className="font-normal text-md">
                        Alle Falldaten verwenden
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specificBackgroundData" id="specificBackgroundData" />
                    <Label htmlFor="specificBackgroundData" className="font-normal text-md">
                        Falldaten auswählen
                    </Label>
                </div>
            </RadioGroup>
            {!outbreakAnalysisStore.settings.includeAllCases && (
                <MultipleSelector
                    options={createFilteredOptions(groupsAndOutbreaks)} //initially get options from database so user can choose one of them
                    value={createOptions(outbreakAnalysisStore.settings.selectedBackground || undefined)} //if options are set in store use them as preselected options
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
