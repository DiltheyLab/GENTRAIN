import { Button } from "@/modules/core/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/modules/core/components/ui/Card";
import { TooltipRenderProps } from "react-joyride";
import MouseCursor from "./MouseCursor";

export function CustomTutorialTourTooltip(props: TooltipRenderProps) {
    console.log(props);

    const { backProps, index, primaryProps, step, tooltipProps, isLastStep, size } = props;

    const getNextButtonText = () => {
        let buttonText = "Weiter";
        if (step?.data?.["next"]) {
            buttonText = "Zur nächsten Seite";
        } else if (isLastStep) {
            buttonText = "Fertig";
        }
        return buttonText;
    };

    return (
        <>
            {step.target === "[data-tutorial-tour-step='dashboard-visualization-panel']" && <MouseCursor />}
            <Card
                {...tooltipProps}
                className="border-none max-w-[380px] max-h-[90vh] overflow-auto"
                style={{ width: step.styles.options.width, zIndex: 10! }}
            >
                <CardHeader>
                    <CardTitle className="text-lg xl:text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs xl:text-[1rem]">{step.content}</CardContent>
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
                        <Button className="max-w-60 text-wrap p-3" {...primaryProps}>
                            {getNextButtonText()}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
