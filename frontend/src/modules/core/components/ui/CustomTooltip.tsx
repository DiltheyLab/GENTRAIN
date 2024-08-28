import { Button } from "@/modules/core/components/ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/core/components/ui/Tooltip";

type CustomTooltipProps = {
    content: React.ReactNode;
    trigger: React.ReactNode;
};

const defaultTrigger = <Button variant="outline">Hover</Button>;

export const CustomTooltip = ({ content, trigger = defaultTrigger }: CustomTooltipProps) => {
    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                <TooltipContent className="w-72">{content}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
