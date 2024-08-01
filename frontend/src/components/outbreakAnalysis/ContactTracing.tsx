import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export const ContactTracing = () => {
    const analysisStore = useAnalysisStore();

    const handleShowContactTracingEdges = (value: boolean) => {
        analysisStore.updateSettings({ showContactTracingEdges: value });
    };

    return (
        <div className="flex flex-row items-center gap-3">
            <Switch
                id="showContactTracingEdges"
                checked={analysisStore.settings.showContactTracingEdges}
                onCheckedChange={(value) => handleShowContactTracingEdges(value)}
            />
            <Label htmlFor="showContactTracingEdges" className="font-normal text-md">
                Kontakte anzeigen
            </Label>
        </div>
    );
};
