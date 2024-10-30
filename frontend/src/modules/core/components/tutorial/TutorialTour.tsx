import { useDisableScollOnComponentMount } from "@/modules/core/hooks/useDisableScrollOnComponentMount";
import { useCoreStore } from "@/modules/core/stores/core";
import Joyride, { CallBackProps, Step } from "react-joyride";
import { CustomTutorialTourTooltip } from "./CustomTutorialTourTooltip";
import { Button } from "@/modules/core/components/ui/Button";
import { DoorOpen } from "lucide-react";

export const TutorialTour = () => {
    const tutorialTourIsActive = useCoreStore((state) => state.tutorialTourIsActive);
    const changeTutorialTourIsActive = useCoreStore((state) => state.changeTutorialTourIsActive);
    useDisableScollOnComponentMount([tutorialTourIsActive]);

    const steps: Step[] = [
        {
            target: "[data-tutorial-tour-step='dashboard-nav']",
            title: "Das Dashboard.",
            content: (
                <p>
                    Das Dashboard bietet Ihnen einen Überblick über Ihre Daten. Es umfasst Einstellungen, Charts, einen
                    minimalen Spannbaum und detaillierte Informationstabellen.
                </p>
            ),
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
                        <div className="space-y-2">
                            <p className="2xl:hidden">
                                <strong>Knoten anklicken:</strong> Klicken Sie mit der linken Maustaste auf einen
                                Knoten, um zusätzliche Informationen zum Fall anzuzeigen.
                            </p>
                            <p className="hidden 2xl:block">
                                <strong>Knoten anklicken:</strong> Klicken Sie mit der linken Maustaste auf einen
                                Knoten, um zusätzliche Informationen zum Fall anzuzeigen (untere rechte Ecke) oder
                                weitere genetische Abstände einzublenden, falls vorhanden (rote gestrichelte Kante).
                            </p>
                            <p>
                                <strong>Knoten verschieben:</strong> Halten Sie die linke Maustaste gedrückt und ziehen
                                Sie den Knoten an die gewünschte Position.
                            </p>
                            <p>
                                <strong>Rein- und Rauszoomen:</strong> Verwenden Sie das Mausrad, um in den Graphen
                                hinein- oder herauszuzoomen.
                            </p>
                        </div>
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
                        className={"rounded-full h-3 w-3 -mt-[1px] mr-1 inline-block"}
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
            content: (
                <p>
                    Mit Hilfe dieser Einstellungen können Sie das Aussehen des Graphen einstellen. Ändern Sie
                    beispielsweise die Kantenlänge ab und schauen Sie sich den Unterschied an.
                </p>
            ),
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: true,
            placement: "left-start",
            disableScrollParentFix: true,
        },
        {
            target: "[data-tutorial-tour-step='dashboard-settings']",
            title: "Einstellungen ändern.",
            content: (
                <p>
                    Sie haben hier die Möglichkeit Fälle im Graphen einzublenden, bei denen keine genetische Sequenz
                    hinterlegt ist. Desweiteren können Sie Kontaktkanten zwischen den Knoten anzeigen lassen.
                </p>
            ),
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: false,
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
            disableScrolling: false,
            placement: "right",
        },
        {
            target: "[data-tutorial-tour-step='dashboard-charts']",
            title: "Die Diagramme.",
            content: (
                <p>
                    Im <strong>oberen Diagramm</strong> sehen Sie die Verteilung der täglich aufgetretenen Fälle. Dies
                    ermöglicht es Ihnen, das Infektionsgeschehen zeitlich besser einzuordnen und Auffälligkeiten direkt
                    zu erkennen.
                    <br />
                    <br />
                    Das <strong>untere Diagramm</strong> zeigt die Anzahl aller Fälle pro Cluster oder Ausbruch,
                    abhängig von der gewählten Einfärbung.
                </p>
            ),
            disableBeacon: true,
            spotlightClicks: true,
            disableScrolling: false,
            placement: "right",
        },
        {
            target: "[data-tutorial-tour-step='dashboard-state-import']",
            title: "Zustände sichern und importieren.",
            content: (
                <>
                    <p>
                        Ihre personenbezogenen Daten <strong>verbleiben ausschließlich in Ihrem Browser</strong> und{" "}
                        <strong>werden nicht übertragen</strong>.
                    </p>
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-4 ">
                        <p>
                            Wenn Sie die <strong>Daten</strong> mit anderen <strong>teilen</strong> möchten oder mit dem
                            gleichen Stand an einem anderen Computer arbeiten wollen, können Sie hier Ihre Daten{" "}
                            <strong>sichern, übertragen und wieder importieren</strong>.
                        </p>
                    </div>
                </>
            ),
            disableBeacon: true,
            spotlightClicks: false,
            disableScrolling: true,
            placement: "bottom",
        },
        {
            target: "[data-tutorial-tour-step='dashboard-pathogen-switch']",
            title: "Andere Pathogene.",
            content: (
                <p>
                    Gentrain unterstützt <strong>virale und bakterielle Pathogene</strong>. Sie können jederzeit das zu
                    bearbeitende Pathogen ändern und entsprechende Fall- und Sequenzdaten dazu hochladen.
                </p>
            ),
            disableBeacon: true,
            spotlightClicks: false,
            placement: "bottom",
            disableScrolling: true,
        },
    ];

    if (!tutorialTourIsActive) return null;

    const handleJoyrideCallback = (state: CallBackProps) => {
        if (state.status === "finished") {
            changeTutorialTourIsActive(false);
            window.scrollTo(0, 0);
        }
    };
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
                callback={(state) => handleJoyrideCallback(state)}
                styles={{
                    spotlight: {
                        borderRadius: 5,
                        zIndex: 40,
                    },
                }}
                scrollOffset={25}
            />
            <Button
                className="text-lg fixed right-5 bottom-5 z-[1001]"
                onClick={() => changeTutorialTourIsActive(false)}
            >
                Tutorial beenden
                <DoorOpen className="ml-2" />
            </Button>
        </>
    );
};
