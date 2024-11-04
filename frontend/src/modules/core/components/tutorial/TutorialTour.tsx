import { useDisableScollOnComponentMount } from "@/modules/core/hooks/useDisableScrollOnComponentMount";
import { useCoreStore } from "@/modules/core/stores/core";
import Joyride, { ACTIONS, CallBackProps, Events, EVENTS, ORIGIN, STATUS, Step } from "react-joyride";
import { CustomTutorialTourTooltip } from "./CustomTutorialTourTooltip";
import { Button } from "@/modules/core/components/ui/Button";
import { DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";

export const TutorialTour = () => {
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    const tutorialIsRunnung = useCoreStore((state) => state.tutorialIsRunnung);
    const steps = useCoreStore((state) => state.tutorialSteps);
    const stepIndex = useCoreStore((state) => state.tutorialStepIndex);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    const changeTutorialIsRunning = useCoreStore((state) => state.changeTutorialIsRunning);
    const changeTutorialStepIndex = useCoreStore((state) => state.changeTutorialStepIndex);
    const updateGeneralSettings = useOutbreakAnalysisStore((state) => state.updateGeneralSettings);
    const openAccordionItems = useOutbreakAnalysisStore((state) => state.generalSettings.openAccordionItems);

    useDisableScollOnComponentMount([tutorialTourIsActive]);
    const navigate = useNavigate();

    if (!tutorialTourIsActive) return null;

    const closeTutorial = () => {
        // Need to set our running state to false, so we can restart if we click start again.
        changeTutorialStepIndex(0);
        changeTutorialIsRunning(false);
        changeTutorialTourIsActive(false);
        window.scrollTo(0, 0);
    };
    console.log(openAccordionItems);

    const handleOutbreakAnalysisAccordion = (step: Step, type: Events) => {
        if (type === EVENTS.STEP_BEFORE) {
            console.log("Target:", step.target);
            switch (step.target) {
                case "[data-tutorial-tour-step='outbreak-analysis-outbreak-selection']":
                    updateGeneralSettings({ openAccordionItems: ["item-1"] });
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-background-selection']":
                    updateGeneralSettings({ openAccordionItems: ["item-2"] });
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-background-filtering']":
                    updateGeneralSettings({ openAccordionItems: ["item-3"] });
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-contact-tracing']":
                    updateGeneralSettings({ openAccordionItems: ["item-4"] });
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-coloring']":
                    updateGeneralSettings({ openAccordionItems: ["item-5"] });
                    break;

                default:
                    break;
            }
        }
    };

    const handleCallback = (data: CallBackProps) => {
        const { action, index, step, type, status, origin } = data;
        console.log("action:", action);
        console.log("index:", index);
        console.log("status:", status);
        console.log("type:", type);
        console.log("step:", step?.data);

        handleOutbreakAnalysisAccordion(step, type);

        // Closes tutorial on pressing ESC-button
        if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
            closeTutorial();
            return;
        }

        // Changes the tutorial step index and closes the tutorial if the status is 'finished' or 'skipped'.
        if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
            const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
            changeTutorialStepIndex(nextStepIndex);
        } else if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
            closeTutorial();
        }

        // Navigates to the next or previous page
        if (type === EVENTS.STEP_AFTER && step?.data?.["next"] && action === ACTIONS.NEXT) {
            navigate(step?.data["next"]);
        } else if (type === EVENTS.STEP_AFTER && step?.data?.["prev"] && action === ACTIONS.PREV) {
            navigate(step?.data["prev"]);
        }
    };
    return (
        <>
            <Joyride
                tooltipComponent={CustomTutorialTourTooltip}
                run={tutorialIsRunnung}
                steps={steps}
                stepIndex={stepIndex}
                continuous={true}
                showProgress={true}
                scrollDuration={500}
                spotlightClicks={true}
                disableOverlayClose={true}
                callback={(data) => handleCallback(data)}
                styles={{
                    spotlight: {
                        borderRadius: 5,
                        zIndex: 40,
                    },
                    options: {
                        overlayColor: "rgba(0,0,0,0.5)",
                    },
                }}
                scrollOffset={25}
            />
            <Button className="text-lg fixed right-5 bottom-5 z-[1001]" onClick={closeTutorial}>
                Tutorial beenden
                <DoorOpen className="ml-2" />
            </Button>
        </>
    );
};
