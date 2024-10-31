import { useDisableScollOnComponentMount } from "@/modules/core/hooks/useDisableScrollOnComponentMount";
import { useCoreStore } from "@/modules/core/stores/core";
import Joyride, { ACTIONS, CallBackProps, Events, EVENTS, ORIGIN, STATUS } from "react-joyride";
import { CustomTutorialTourTooltip } from "./CustomTutorialTourTooltip";
import { Button } from "@/modules/core/components/ui/Button";
import { DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TutorialTour = () => {
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    const tutorialIsRunnung = useCoreStore((state) => state.tutorialIsRunnung);
    const steps = useCoreStore((state) => state.tutorialSteps);
    const stepIndex = useCoreStore((state) => state.tutorialStepIndex);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    const changeTutorialIsRunning = useCoreStore((state) => state.changeTutorialIsRunning);
    const changeTutorialStepIndex = useCoreStore((state) => state.changeTutorialStepIndex);
    useDisableScollOnComponentMount([tutorialTourIsActive]);

    if (!tutorialTourIsActive) return null;

    const closeTutorial = () => {
        // Need to set our running state to false, so we can restart if we click start again.
        changeTutorialStepIndex(0);
        changeTutorialIsRunning(false);
        changeTutorialTourIsActive(false);
        window.scrollTo(0, 0);
    };

    const handleCallback = (data: CallBackProps) => {
        const {
            action,
            index,
            step: {
                data: { next, previous },
            },
            type,
            status,
            origin,
        } = data;
        console.log("action:", action);
        console.log("index:", index);
        console.log("status:", status);
        console.log("type:", type);
        if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
            closeTutorial();
            return;
        }
        if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
            const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
            changeTutorialStepIndex(nextStepIndex);
        } else if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
            closeTutorial();
        }
        /*
        if (type === "step:after") {
            if (index < 2) {
                changeTutorialIsRunning(false);

                             navigate(isPreviousAction && previous ? previous : next);
                 
            }
           
            if (index === 2) {
                if (isPreviousAction && previous) {
                    changeTutorialIsRunning(false);
                    navigate(previous);
                } else {
                    setState({ run: false, stepIndex: 0, tourActive: false });
                } 
            }
        } */
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
