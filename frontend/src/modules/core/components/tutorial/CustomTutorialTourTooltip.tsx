import { Button } from "@/modules/core/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/modules/core/components/ui/Card";
import { TooltipRenderProps } from "react-joyride";
import MouseCursor from "./MouseCursor";

export function CustomTutorialTourTooltip(props: TooltipRenderProps) {
    const { backProps, index, primaryProps, step, tooltipProps, isLastStep, size } = props;

    return (
        <>
            {step.target === "[data-tutorial-tour-step='dashboard-visualization-panel']" && <MouseCursor />}
            <Card
                {...tooltipProps}
                className="border-none max-w-[380px] max-h-[90vh] overflow-auto"
                style={{ width: step.styles.options.width, zIndex: 10! }}
            >
                <CardHeader>
                    <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>{step.content}</CardContent>
                <CardFooter className="flex justify-between gap-3 flex-col-reverse xl:flex-row">
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
        </>
    );
}
