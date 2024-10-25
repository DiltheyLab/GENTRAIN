import { Button } from "@/modules/core/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/modules/core/components/ui/Card";
import { TooltipRenderProps } from "react-joyride";

export function CustomTutorialTourTooltip(props: TooltipRenderProps) {
    const { backProps, index, primaryProps, step, tooltipProps, isLastStep, size } = props;

    return (
        <Card {...tooltipProps} className="w-[310px] xl:w-[380px] border-none">
            <CardHeader>
                <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{step.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between space-x-3">
                <small className="text-sm text-muted-foreground">
                    Schritt {index + 1} von {size}
                </small>
                <div className="flex space-x-3">
                    {index > 0 && (
                        <Button variant="outline" {...backProps}>
                            Zurück
                        </Button>
                    )}
                    <Button {...primaryProps}>{isLastStep ? "Fertig" : "Weiter"}</Button>
                </div>
            </CardFooter>
        </Card>
    );
}
