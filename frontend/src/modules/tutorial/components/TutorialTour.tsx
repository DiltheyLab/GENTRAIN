import Joyride, { ACTIONS, CallBackProps, Events, EVENTS, STATUS } from "react-joyride";
import { DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisableScrollOnComponentMount } from "@/modules/core/hooks/useDisableScrollOnComponentMount";
import { CustomTutorialTourTooltip } from "./CustomTutorialTourTooltip";
import { Button } from "@/modules/core/components/ui/Button";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { dbManager } from "@/modules/core/services/database/DatabaseManager";
import { useTutorialStore } from "../stores/tutorial";

export const TutorialTour = () => {
    const tutorialTourIsActive = useTutorialStore((state) => state.tutorialTourIsActive);
    const tutorialIsRunning = useTutorialStore((state) => state.tutorialIsRunning);
    const steps = useTutorialStore((state) => state.tutorialSteps);
    const stepIndex = useTutorialStore((state) => state.tutorialStepIndex);
    const changeTutorialTourIsActive = useTutorialStore((state) => state.changeTutorialTourIsActive);
    const changeTutorialIsRunning = useTutorialStore((state) => state.changeTutorialIsRunning);
    const changeTutorialStepIndex = useTutorialStore((state) => state.changeTutorialStepIndex);
    const updateOutbreakAnalysisAccordion = useOutbreakAnalysisStore((state) => state.updateGeneralSettings);
    useDisableScrollOnComponentMount([tutorialTourIsActive]);
    const navigate = useNavigate();

    if (!tutorialTourIsActive) return null;

    const closeTutorial = () => {
        changeTutorialStepIndex(0);
        changeTutorialIsRunning(false);
        changeTutorialTourIsActive(false);
        navigate("/");
        window.scrollTo(0, 0);
        dbManager.switchDatabase("gentrain");
        window.location.reload();
    };

    const scrollWindowToTopAndChangeIndex = (nextStepIndex: number) => {
        changeTutorialStepIndex(nextStepIndex);
        window.scrollTo(0, 0);
    };

    //Updates the accordion state and continues the tutorial with a delay.
    const updateAccordionAndContinueWithDelay = (nextStepIndex: number, openAccordionItems: string[], delay = 350) => {
        changeTutorialIsRunning(false);
        updateOutbreakAnalysisAccordion({ openAccordionItems: openAccordionItems });
        changeTutorialStepIndex(nextStepIndex);
        setTimeout(() => {
            changeTutorialIsRunning(true);
        }, delay);
    };

    const handleCallback = ({ action, index, step, type, status }: CallBackProps) => {
        const nextStep = action === ACTIONS.NEXT;
        const prevStep = action === ACTIONS.PREV;
        const nextStepIndex = index + (prevStep ? -1 : 1);

        const manageTutorialStep = () => {
            switch (step.target) {
                case "[data-tutorial-tour-step='outbreak-analysis-overview-nav']":
                    if (nextStep) scrollWindowToTopAndChangeIndex(nextStepIndex);
                    else if (prevStep) changeTutorialStepIndex(nextStepIndex);
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-overview-start']":
                    if (nextStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["outbreak-selection"]);
                    else if (prevStep) changeTutorialStepIndex(nextStepIndex);
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-outbreak-selection']":
                    if (nextStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["background-selection"]);
                    else if (prevStep) changeTutorialStepIndex(nextStepIndex);
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-background-selection']":
                    if (nextStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["case-filtering"]);
                    else if (prevStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["outbreak-selection"]);
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-case-filtering']":
                    if (nextStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["contact-tracing"]);
                    else if (prevStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["background-selection"]);
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-contact-tracing']":
                    if (nextStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["coloring"]);
                    else if (prevStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["case-filtering"]);
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-coloring']":
                    if (nextStep) updateAccordionAndContinueWithDelay(nextStepIndex, [], 0);
                    else if (prevStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["contact-tracing"]);
                    break;
                case "[data-tutorial-tour-step='outbreak-analysis-visualization-panel']":
                    if (nextStep) changeTutorialStepIndex(nextStepIndex);
                    else if (prevStep) updateAccordionAndContinueWithDelay(nextStepIndex, ["coloring"]);
                    break;
                default:
                    changeTutorialStepIndex(nextStepIndex);
            }
        };

        // Check if element is mounted after tour started and wait for it.
        // If it is not ready which happens if you reload the page try it again for 100 sec
        if (type === EVENTS.TOUR_START) {
            changeTutorialIsRunning(false);

            let attempts = 0;
            const maxAttempts = 100; // 10 seconds maximum (100 * 100ms)

            const waitForElement = () => {
                const target = typeof step.target === "string" ? step.target : step.target.toString();
                const element = document.querySelector(target);

                if (element) {
                    changeTutorialIsRunning(true);
                } else if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(waitForElement, 100);
                } else {
                    console.warn("Tutorial target element not found after maximum attempts");
                    changeTutorialStepIndex(index - 1); // Fallback if element never appears
                }
            };

            waitForElement();
            return;
        }

        // Closes tutorial if tour is over
        if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
            closeTutorial();
            return;
        }

        // Changes the tutorial step index on pressing the next or previous button
        if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
            manageTutorialStep();
        }

        // Navigates to the next or previous page
        if (type === EVENTS.STEP_AFTER && step?.data?.["next"] && nextStep) {
            navigate(step?.data["next"]);
        } else if (type === EVENTS.STEP_AFTER && step?.data?.["prev"] && prevStep) {
            navigate(step?.data["prev"]);
        }
    };

    return (
        <>
            <Joyride
                tooltipComponent={CustomTutorialTourTooltip}
                run={tutorialIsRunning}
                steps={steps}
                stepIndex={stepIndex}
                continuous={true}
                showProgress={true}
                scrollDuration={500}
                disableOverlayClose={true}
                callback={handleCallback}
                styles={{
                    spotlight: {
                        borderRadius: 5,
                        zIndex: 40,
                    },
                    options: {
                        overlayColor: "rgba(0,0,0,0.5)",
                    },
                }}
                scrollOffset={70}
                disableCloseOnEsc={true}
            />
            <Button className="text-lg fixed right-5 bottom-5 z-[1001]" onClick={closeTutorial}>
                Tutorial beenden
                <DoorOpen className="ml-2" />
            </Button>
        </>
    );
};
