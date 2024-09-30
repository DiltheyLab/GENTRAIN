import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { Label } from "@/modules/core/components/ui/Label";
import { Switch } from "@/modules/core/components/ui/Switch";

export const ContactTracing = () => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore();

    const handleShowContactTracingLinks = (value: boolean) => {
        outbreakAnalysisStore.updateAnalysisSettings({ showContactTracingLinks: value });
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="showContactTracingLinks"
                    checked={outbreakAnalysisStore.analysisSettings.showContactTracingLinks}
                    onCheckedChange={(value) => handleShowContactTracingLinks(value)}
                />
                <Label htmlFor="showContactTracingLinks" className="text-md">
                    Kontaktkanten anzeigen
                </Label>
            </div>
        </div>
    );
};
