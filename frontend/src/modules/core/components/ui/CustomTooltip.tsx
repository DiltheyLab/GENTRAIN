import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/core/components/ui/Tooltip";
import { Info } from "lucide-react";

type CustomTooltipProps = {
    content: React.ReactNode;
    disabled?: boolean;
};

export const CustomTooltip = ({ content, disabled = false }: CustomTooltipProps) => {
    if (disabled) {
        return <Info aria-disabled className="h-5 w-5 mb-1 text-slate-900/50" />;
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="h-5 w-5 cursor-pointer mb-1" />
                </TooltipTrigger>
                <TooltipContent className="w-72">{content}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
