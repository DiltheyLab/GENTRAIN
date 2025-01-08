import { GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { Expand } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../helpers/cn";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/Tooltip";

type ZoomToFitProps = {
    zoomToFitToggle: boolean;
    updateGraphSettings: (newSettings: Partial<GraphSettings>) => void;
    className?: string;
};

export const ZoomToFitIcon = ({ zoomToFitToggle, updateGraphSettings, className }: ZoomToFitProps) => {
    return (
        <TooltipProvider delayDuration={100} skipDelayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute z-10 right-1 bottom-1 hover:text-primary text-slate-800 pdf-hide",
                            className
                        )}
                        onClick={() => updateGraphSettings({ zoomToFitToggle: !zoomToFitToggle })}
                    >
                        <Expand size={25} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Graph zentrieren</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
