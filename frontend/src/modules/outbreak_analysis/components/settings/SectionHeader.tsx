import { Label } from "@/modules/core/components/ui/Label";
import { StepIndicator } from "@/modules/core/components/ui/StepIndicator";
import { CustomTooltip } from "@/modules/core/components/ui/CustomTooltip";
import { Info } from "lucide-react";
import { cn } from "@/modules/core/helpers/cn";

type SectionHeaderProps = {
    step?: number;
    title: string;
    tooltipContent: JSX.Element;
    className?: string;
};

export const SectionHeader = ({ step, title, tooltipContent, className }: SectionHeaderProps) => {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <Label className="flex items-center font-bold text-md mr-3 mb-1">
                {step && <StepIndicator>{step}</StepIndicator>}
                {title}
            </Label>

            <CustomTooltip trigger={<Info className="h-5 w-5 cursor-pointer" />} content={tooltipContent} />
        </div>
    );
};
