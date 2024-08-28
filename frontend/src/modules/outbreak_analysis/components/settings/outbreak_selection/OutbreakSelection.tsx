import { useGetAllCasesForActivePathogenWithRelationships } from "@/modules/core/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/modules/core/components/ui/Select";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import { createColorMapForNodes } from "@/modules/core/helpers/graphs";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";
import { CaseWithRelationships } from "@/modules/core/models/cases";

export const OutbreakSelection = () => {
    const analysisStore = useOutbreakAnalysisStore();
    const outbreaks = useGetOutbreaksForActivePathogen();
    const casesWithRelationships = useGetAllCasesForActivePathogenWithRelationships();

    const setDateRange = (selectedOutbreak: OutbreakSchema) => {
        const casesInOutbreak = casesWithRelationships?.filter((caseWithRelationships) => {
            return caseWithRelationships.outbreak_id === selectedOutbreak.id;
        });

        let dateRange = casesInOutbreak?.map((caseInOutbreak) => caseInOutbreak.registered_at);
        dateRange = dateRange?.sort((a, b) => a.getTime() - b.getTime());
        if (!dateRange || dateRange.length === 0) return;

        const startDate = dateRange[0];
        const endDate = dateRange[dateRange.length - 1];

        // Add 7 days to the start and end date as default selected date range
        const modifiedDateRange = {
            from: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            to: new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        };

        // set the initial date range for the date range filter
        analysisStore.updateSettings({
            dateRange: modifiedDateRange,
        });

        // set the date range for the outbreak to color it in the date picker
        analysisStore.updateSettings({
            datesOfCasesInSelectedOutbreak: dateRange,
        });
    };

    const createColorMap = (cases: CaseWithRelationships[], selectedOutbreak: OutbreakSchema) => {
        // create the initial color map for all nodes if the selected outbreak is changed
        const colorMap = createColorMapForNodes(selectedOutbreak, cases);
        // merge the new color map with the current color map in case there are already colors set (e.g. for time span)
        const currentColorMap = { ...analysisStore.graphSettings.colorMap };
        analysisStore.updateGraphSettings({ colorMap: { ...currentColorMap, ...colorMap } });
    };

    const changeSelectedOutbreak = (id: string) => {
        const selectedOutbreak = outbreaks?.find((outbreak) => outbreak.id === +id);
        if (!selectedOutbreak) return;
        analysisStore.updateSettings({
            selectedOutbreak: {
                name: selectedOutbreak.name,
                pathogen_id: selectedOutbreak.pathogen_id,
                id: selectedOutbreak.id,
            },
        });

        // after changing the outbreak, set the date range for the date range picker
        setDateRange(selectedOutbreak);

        // create color map for nodes after changing the outbreak
        if (!casesWithRelationships) return;
        createColorMap(casesWithRelationships, selectedOutbreak);
    };

    const getOutbreakGroups = () => {
        if (!outbreaks || outbreaks.length === 0) {
            return (
                <SelectGroup>
                    <SelectLabel>Keine Ausbrüche gefunden</SelectLabel>
                </SelectGroup>
            );
        }
        return (
            <SelectGroup>
                <SelectLabel>Ausbrüche</SelectLabel>
                {outbreaks.map((outbreak) => {
                    return (
                        <SelectItem key={outbreak.id} value={outbreak.id.toString()}>
                            {outbreak.name}
                        </SelectItem>
                    );
                })}
            </SelectGroup>
        );
    };
    return (
        <div className="flex flex-col gap-4 p-0">
            <Select
                value={analysisStore.settings.selectedOutbreak?.id?.toString()}
                onValueChange={(value) => changeSelectedOutbreak(value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Bitte auswählen" />
                </SelectTrigger>
                <SelectContent>{getOutbreakGroups()}</SelectContent>
            </Select>
        </div>
    );
};
