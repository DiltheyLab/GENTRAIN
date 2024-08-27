import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";

export const ContactTracing = () => {
    const analysisStore = useAnalysisStore();

    const handleShowContactTracingLinks = (value: boolean) => {
        analysisStore.updateSettings({ showContactTracingLinks: value });
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="showContactTracingLinks"
                    checked={analysisStore.settings.showContactTracingLinks}
                    onCheckedChange={(value) => handleShowContactTracingLinks(value)}
                />
                <Label htmlFor="showContactTracingLinks" className="font-normal text-md">
                    Kontaktkanten anzeigen
                </Label>
            </div>
        </div>
    );
};
