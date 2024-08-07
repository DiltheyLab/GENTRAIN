import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { StepIndicator } from "../ui/step-indicator";
import { CustomTooltip } from "../ui/customTooltip";
import { Info } from "lucide-react";

export const ContactTracing = () => {
    const analysisStore = useAnalysisStore();

    const handleShowContactTracingEdges = (value: boolean) => {
        analysisStore.updateSettings({ showContactTracingEdges: value });
    };

    return (
        <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
                <Label className="flex items-center font-bold text-md mr-3">
                    <StepIndicator>4</StepIndicator>Kontaktnachverfolgung
                </Label>
                <CustomTooltip
                    trigger={<Info className="h-5 w-5 cursor-pointer" />}
                    content={<p>Sie können hier die Kontakte, die sie hochgeladen haben, anzeigen lassen.</p>}
                />
            </div>
            <div className="flex flex-row items-center gap-3">
                <Switch
                    id="showContactTracingEdges"
                    checked={analysisStore.settings.showContactTracingEdges}
                    onCheckedChange={(value) => handleShowContactTracingEdges(value)}
                />
                <Label htmlFor="showContactTracingEdges" className="font-normal text-md">
                    Kontaktkanten anzeigen
                </Label>
            </div>
        </div>
    );
};
