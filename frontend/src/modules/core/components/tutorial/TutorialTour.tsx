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
            title: "Der minimale Spannbaum.",
            content: (
                <>
                    <p className="mb-4">
                        Zu den hochgeladenen Falldaten und deren genetischen Sequenzen berechnen wir die genetischen
                        Abstände und zeigen alle Daten in einem minimalen Spannbaum (MST) an.
                    </p>
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                        <h2 className="text-lg font-bold mb-2">Interaktionen mit dem Graphen</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li className="2xl:hidden">
                                <strong>Knoten anklicken:</strong> Klicken Sie mit der linken Maustaste auf einen
                                Knoten, um zusätzliche Informationen zum Fall anzuzeigen.
                            </li>
                            <li className="hidden 2xl:block">
                                <strong>Knoten anklicken:</strong> Klicken Sie mit der linken Maustaste auf einen
                                Knoten, um zusätzliche Informationen zum Fall anzuzeigen (untere rechte Ecke) oder
                                weitere genetische Abstände einzublenden, falls vorhanden (rote gestrichelte Kante).
                            </li>
                            <li>
                                <strong>Knoten verschieben:</strong> Halten Sie die linke Maustaste gedrückt und ziehen
                                Sie den Knoten an die gewünschte Position.
                            </li>
                            <li>
                                <strong>Rein- und Rauszoomen:</strong> Verwenden Sie das Mausrad, um in den Graphen
                                hinein- oder herauszuzoomen.
                            </li>
                        </ul>
                    </div>
                </>
            ),
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "left-start",
            styles: {
                options: {
                    width: "20vw", //ensures that the tooltip is not floating below the graph even if the screen width is 1024px
                },
            },
        },
        {
            target: "[data-tutorial-tour-step='dashboard-visualization-panel-legend']",
            title: "Die Legende.",
            content: (
                <p>
                    Hier sehen Sie Informationen über Knoten und Kanten des Graphen. Alle blau eingefärbten Knoten
                    gehören beispielsweise zum Ausbruch <br />
                    <span
                        style={{
                            backgroundColor: "#0000FF",
                        }}
                        className={"rounded-full h-3 w-3 -mt-[1px] mr-2 inline-block"}
                    />
                    <strong>Schule A</strong>.
                </p>
            ),
            disableBeacon: true,
            spotlightClicks: false,
            disableScrolling: true,
            placement: "left-start",
            styles: {
                options: {
                    width: "20vw",
                },
            },
        },
        {
            target: "[data-tutorial-tour-step='dashboard-visualization-panel-graph-settings']",
            title: "Die Grapheneinstellungen.",
            content:
                "Mit Hilfe dieser Einstellungen können Sie das Aussehen des Graphen einstellen. Ändern Sie beispielsweise die Kantenlänge ab und schauen Sie sich den Unterschied an.",
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "left-start",
            styles: {
                spotlight: {
                    borderRadius: 0,
                },
            },
        },
        {
            target: "[data-tutorial-tour-step='dashboard-settings']",
            title: "Einstellungen ändern.",
            content:
                "Sie haben hier die Möglichkeit Fälle im Graphen einzublenden, bei denen keine genetische Sequenz hinterlegt ist. Desweiteren können Sie Kontaktkanten zwischen den Knoten anzeigen lassen.",
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "right",
        },
        {
            target: "[data-tutorial-tour-step='dashboard-coloring']",
            title: "Einfärbungen ändern.",
            content: (
                <>
                    <p>
                        Sie können bei dieser Einstellung die Knoten nach Ausbrüchen, der Zeitspanne oder nach Clustern
                        einfärben. Bei der Einstellung <strong>Cluster</strong> werden die Knoten abhängig von dem{" "}
                        <strong>Clusterschwellenwert </strong>eingefärbt.
                    </p>
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-2">
                        <p>
                            Der standardmäßig eingestellte Clusterschwellenwert hängt vom aktiven Pathogen ab. Bei
                            Covid-19 kann man bei einer genetischen Distanz von ≤ 1 davon ausgehen, dass es sich um eine
                            Infektion mit dem gleichen Erreger handelt.
                        </p>
                    </div>
                </>
            ),
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
                styles={{
                    spotlight: {
                        borderRadius: 5,
                        zIndex: 40,
                    },
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
