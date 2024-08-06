import { useAnalysisStore } from "@/stores/analysis";
import { Label } from "../ui/label";
import { StepIndicator } from "../ui/step-indicator";
import { CustomTooltip } from "../ui/customTooltip";
import { Info } from "lucide-react";

export const ColorSelection = () => {
    const analysisStore = useAnalysisStore();

    return (
        <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
                <Label className="flex items-center font-bold text-md mr-3">
                    <StepIndicator>5</StepIndicator>Einfärbung
                </Label>
                <CustomTooltip
                    trigger={<Info className="h-5 w-5 cursor-pointer" />}
                    content={<p>Sie können hier Einstellungen an der Farbe vornehmen.</p>}
                />
            </div>
        </div>
    );
};
