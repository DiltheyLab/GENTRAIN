import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

import { useAnalysisStore } from "@/stores/analysis";
import { useGetAllOutbreaks } from "@/hooks/database/outbreaks/useGetAllOutbreaks";
import { updateAnalysisSettings } from "@/database/analyses";
import { useToast } from "../ui/use-toast";
import { Switch } from "../ui/switch";

export const AnalysisSettings = () => {
    const analysisStore = useAnalysisStore();
    const outbreaks = useGetAllOutbreaks();
    const { toast } = useToast();

    const changeSelectedOutbreak = (id: string) => {
        const selectedOutbreak = outbreaks?.find((outbreak) => outbreak.id === +id);
        if (!selectedOutbreak) return;
        analysisStore.updateSettings({ selectedOutbreak: { name: selectedOutbreak.name, id: selectedOutbreak.id } });
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

    const safeAnalysis = async () => {
        if (!analysisStore.id) return;
        try {
            await updateAnalysisSettings(analysisStore.id, analysisStore.settings);
        } catch (error) {
            toast({
                title: "Fehler beim Speichern der Analyse",
                description: "Die Analyse konnte nicht gespeichert werden. Bitte versuche es erneut.",
                duration: 10000,
            });
            console.error("Error while saving analysis", error);
        }
    };

    const handleIgnoreBackground = (value: boolean) => {
        analysisStore.updateSettings({ ignoreBackground: value });
    };

    return (
        <div className="relative flex-col items-center gap-8 flex" x-chunk="dashboard-03-chunk-0">
            <form className="w-full items-start gap-3">
                <fieldset className="flex flex-col gap-6 rounded-lg border p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="name" className="font-bold text-lg">
                                1. Ausbruch auswählen:
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
                        <Button type="button" onClick={() => safeAnalysis()}>
                            Analyse speichern
                        </Button>
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
                        <p>{analysisStore.settings.selectedOutbreak?.name}</p>
                        <p>ID: {analysisStore.settings.selectedOutbreak?.id}</p>
                        <p>JSON: {JSON.stringify(analysisStore.settings.selectedOutbreak)}</p>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
