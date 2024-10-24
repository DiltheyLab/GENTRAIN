import { useDisableScollOnComponentMount } from "@/modules/core/hooks/useDisableScrollOnComponentMount";
import { useCoreStore } from "@/modules/core/stores/core";
import Joyride, { Step } from "react-joyride";
import { CustomTutorialTourTooltip } from "./CustomTutorialTourTooltip";

export const TutorialTour = () => {
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    useDisableScollOnComponentMount([tutorialTourIsActive]);

    const steps: Step[] = [
        {
            target: "[data-tutorial-tour-step='1']",
            title: "Das ist der Title",
            content: "This another awesome feature!",
            disableBeacon: true,
            spotlightClicks: false,
        },
        {
            target: "[data-tutorial-tour-step='2']",
            title: "Das ist der Title",
            content: "This another awesome feature!",
            disableBeacon: true,
            spotlightClicks: true,
        },
        {
            target: "[data-tutorial-tour-step='3']",
            title: "Das ist der Title",
            content: "This another awesome feature!",
            disableBeacon: true,
            spotlightClicks: false,
        },
        {
            target: "[data-tutorial-tour-step='4']",
            title: "Das ist der Title",
            content: "This another awesome feature!",
            disableBeacon: true,
            spotlightClicks: false,
        },
    ];

    if (!tutorialTourIsActive) return null;

    return (
        <Joyride
            tooltipComponent={CustomTutorialTourTooltip}
            steps={steps}
            continuous={true}
            showProgress={true}
            scrollDuration={500}
            spotlightClicks={true}
            disableOverlayClose={true}
            callback={(state) => {
                if (state.status === "finished") {
                    changeTutorialTourIsActive(false);
                }
            }}
            styles={{
                options: {
                    arrowColor: "#fff",
                    backgroundColor: "#fff",
                    beaconSize: 36,
                    overlayColor: "rgba(0, 0, 0, 0.5)",
                    primaryColor: "hsl(var(--primary))",
                    spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
                    textColor: "#000",
                    width: undefined,
                    zIndex: 1000,
                },
            }}
        />
    );
};
