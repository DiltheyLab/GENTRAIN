import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
