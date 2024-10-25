import { useDisableScollOnComponentMount } from "@/modules/core/hooks/useDisableScrollOnComponentMount";
import { useCoreStore } from "@/modules/core/stores/core";
import Joyride, { Step } from "react-joyride";
import { CustomTutorialTourTooltip } from "./CustomTutorialTourTooltip";
import { Button } from "@/modules/core/components/ui/Button";

export const TutorialTour = () => {
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    useDisableScollOnComponentMount([tutorialTourIsActive]);

    const steps: Step[] = [
        {
            target: "[data-tutorial-tour-step='dashboard-nav']",
            title: "Das Dashboard.",
            content:
                "Das Dashboard bietet Ihnen einen umfassenden Überblick über Ihre Daten. Es umfasst Einstellungen, Diagramme, Visualisierungen und detaillierte Informationstabellen.",
            disableBeacon: true,
            spotlightClicks: false,
            disableScrolling: true,
        },
        {
            target: "[data-tutorial-tour-step='dashboard-visualization-panel']",
            title: "Einstellungen ändern.",
            content:
                "Sie haben hier die Möglichkeit Fälle im Graphen einzublenden, bei denen keine genetische Sequenz hinterlegt ist. Desweiteren können Kontaktkanten zwischen den Knoten eingeblenden werden.",
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "left-start",
        },
        {
            target: "[data-tutorial-tour-step='dashboard-settings']",
            title: "Einstellungen ändern.",
            content:
                "Sie haben hier die Möglichkeit Fälle im Graphen einzublenden, bei denen keine genetische Sequenz hinterlegt ist. Desweiteren können Kontaktkanten zwischen den Knoten eingeblenden werden.",
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "right",
        },
        {
            target: "[data-tutorial-tour-step='dashboard-coloring']",
            title: "Einfärbungen ändern.",
            content:
                "Sie haben hier die Möglichkeit Fälle im Graphen einzublenden, bei denen keine genetische Sequenz hinterlegt ist. Desweiteren können Kontaktkanten zwischen den Knoten eingeblenden werden.",
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "right",
        },
        /*   {
            target: "[data-tutorial-tour-step='2']",
            title: "Die Ausbruchsanalyse.",
            content:
                "Die Ausbruchsanalyse hilft Ihnen, Ausbrüche zu analysieren und Infektionsketten nachzuvollziehen.",
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
        }, */
        {
            target: "[data-tutorial-tour-step='3']",
            title: "Die Datenverwaltung.",
            content: "This another awesome feature!",
            disableBeacon: true,
            spotlightClicks: false,
            disableScrolling: true,
        },
        {
            target: "[data-tutorial-tour-step='4']",
            title: "Zustände sichern und importieren.",
            content: "Hier können Sie die Daten, die Sie ber",
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "right",
        },
        {
            target: "[data-tutorial-tour-step='5']",
            title: "Andere Pathogene auswählen.",
            content: "Sie haben hier die Möglichkeit zwischen Pathogenen zu wechseln.",
            disableBeacon: true,
            spotlightClicks: true,
            placement: "right",
            disableScrolling: true,
        },
    ];

    if (!tutorialTourIsActive) return null;

    return (
        <>
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
            />
            <Button
                className="font-bold text-xl fixed right-5 bottom-5 z-[1001] tracking-tight"
                onClick={() => changeTutorialTourIsActive(false)}
            >
                Tutorial beenden
            </Button>
        </>
    );
};
