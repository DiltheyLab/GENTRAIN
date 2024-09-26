import { Label } from "@/modules/core/components/ui/Label";
import { StepIndicator } from "@/modules/core/components/ui/StepIndicator";
import { CustomTooltip } from "@/modules/core/components/ui/CustomTooltip";
import { cn } from "@/modules/core/helpers/cn";

type SectionHeaderProps = {
    step?: number;
    title: string;
    tooltipContent: JSX.Element;
    className?: string;
    disabled?: boolean;
};

export const SectionHeader = ({ step = 1, title, tooltipContent, className, disabled = false }: SectionHeaderProps) => {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <Label
                className={cn(
                    "flex items-center font-bold text-md mr-3 mb-1",
                    disabled ? "text-slate-900/50" : "cursor-pointer"
                )}
            >
                {step && <StepIndicator className={cn(disabled && "bg-slate-900/50")}>{step}</StepIndicator>}
                {title}
            </Label>

            <CustomTooltip disabled={disabled} content={tooltipContent} />
        </div>
    );
};
