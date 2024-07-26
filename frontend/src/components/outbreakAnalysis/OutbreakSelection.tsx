import { useGetAllCasesWithRelationships } from "@/hooks/database/cases/useGetAllCasesWithRelationships";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useGetAllOutbreaks } from "@/hooks/database/outbreaks/useGetAllOutbreaks";
import { useAnalysisStore } from "@/stores/analysis";
import { OutbreakSchema } from "@/database/outbreak";

export const OutbreakSelection = () => {
    const analysisStore = useAnalysisStore();
    const outbreaks = useGetAllOutbreaks();
    const caseWithRelationships = useGetAllCasesWithRelationships();

    const setDateRange = (selectedOutbreak: OutbreakSchema) => {
        const casesInOutbreak = caseWithRelationships?.filter((caseWithRelationship) => {
            return caseWithRelationship.outbreak_id === selectedOutbreak.id;
        });
        let dateRange = casesInOutbreak?.map((caseInOutbreak) => caseInOutbreak.registered_at);
        dateRange = dateRange?.sort((a, b) => a.getTime() - b.getTime());
        if (!dateRange || dateRange.length === 0) return;

        analysisStore.updateSettings({
            dateRange: { from: dateRange[0], to: dateRange[dateRange.length - 1] },
        });
    };

    const changeSelectedOutbreak = (id: string) => {
        const selectedOutbreak = outbreaks?.find((outbreak) => outbreak.id === +id);
        if (!selectedOutbreak) return;
        analysisStore.updateSettings({
            selectedOutbreak: { name: selectedOutbreak.name, id: selectedOutbreak.id },
        });

        // after changing the outbreak, set the date range for the date range picker
        setDateRange(selectedOutbreak);
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
        <div className="flex flex-col gap-4">
            <Label htmlFor="name" className="font-bold text-lg">
                1. Ausbruch auswählen
            </Label>
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
