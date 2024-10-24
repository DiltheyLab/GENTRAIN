import { Button } from "@/modules/core/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/modules/core/components/ui/Card";
import { useCoreStore } from "@/modules/core/stores/core";
import { X } from "lucide-react";
import { TooltipRenderProps } from "react-joyride";

export function CustomTutorialTourTooltip(props: TooltipRenderProps) {
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);

    const { backProps, closeProps, index, primaryProps, step, tooltipProps, isLastStep, size } = props;

    return (
        <Card {...tooltipProps} className="w-[350px] border-none">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{step.title}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => changeTutorialTourIsActive(false)}>
                        <X size={20} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <p>{step.content}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-3 ">
                {index > 0 && (
                    <Button variant="outline" {...backProps}>
                        Zurück
                    </Button>
                )}
                <Button {...primaryProps}>{isLastStep ? "Fertig" : "Weiter"}</Button>
            </CardFooter>
            <div className="text-center text-sm text-muted-foreground pb-2">
                Schritt {index + 1} von {size}
            </div>
        </Card>
    );
}
