import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { Label } from "../../../core/components/ui/Label";
import { Switch } from "../../../core/components/ui/Switch";

export const ContactTracing = () => {
    const analysisStore = useOutbreakAnalysisStore();

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
