import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/core/components/ui/Tooltip";
import { Info } from "lucide-react";
import { cn } from "../../helpers/cn";

type CustomTooltipProps = {
    content: React.ReactNode;
    disabled?: boolean;
    classname?: string;
};

export const CustomTooltip = ({ content, disabled = false, classname = "" }: CustomTooltipProps) => {
    if (disabled) {
        return <Info aria-disabled className="h-5 w-5 mb-1 text-slate-900/50" />;
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild className={cn(classname)}>
                    <Info className="h-5 w-5 cursor-pointer mb-1" />
                </TooltipTrigger>
                <TooltipContent className="w-72 font-normal">{content}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
