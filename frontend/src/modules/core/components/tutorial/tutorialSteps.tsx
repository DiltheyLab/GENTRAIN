import { Step } from "react-joyride";

export const tutorialSteps: Step[] = [
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
                            <strong>Knoten anklicken:</strong> Klicken Sie mit der linken Maustaste auf einen Knoten, um
                            zusätzliche Informationen zum Fall anzuzeigen.
                        </p>
                        <p className="hidden 2xl:block">
                            <strong>Knoten anklicken:</strong> Klicken Sie mit der linken Maustaste auf einen Knoten, um
                            zusätzliche Informationen zum Fall anzuzeigen (untere rechte Ecke) oder weitere genetische
                            Abstände einzublenden, falls vorhanden (rote gestrichelte Kante).
                        </p>
                        <p>
                            <strong>Knoten verschieben:</strong> Halten Sie die linke Maustaste gedrückt und ziehen Sie
                            den Knoten an die gewünschte Position.
                        </p>
                        <p>
                            <strong>Rein- und Rauszoomen:</strong> Verwenden Sie das Mausrad, um in den Graphen hinein-
                            oder herauszuzoomen.
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
                Hier sehen Sie Informationen über Knoten und Kanten des Graphen. Alle{" "}
                <strong>
                    {" "}
                    blau ({" "}
                    <span
                        style={{
                            backgroundColor: "#0000FF",
                        }}
                        className={"rounded-full h-3 w-3 -mt-[1px] mr-1 inline-block"}
                    />
                    ) eingefärbten Knoten
                </strong>{" "}
                gehören beispielsweise zum Ausbruch <strong>Schule A</strong>.
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
                Mit Hilfe dieser Einstellungen können Sie das Aussehen des Graphen einstellen. Ändern Sie beispielsweise
                die Kantenlänge ab und schauen Sie sich den Unterschied an.
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
                        Der standardmäßig eingestellte Clusterschwellenwert hängt vom aktiven Pathogen ab. Bei Covid-19
                        kann man bei einer genetischen Distanz von ≤ 1 davon ausgehen, dass es sich um eine Infektion
                        mit dem gleichen Erreger handelt.
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
                ermöglicht es Ihnen, das Infektionsgeschehen zeitlich besser einzuordnen und Auffälligkeiten direkt zu
                erkennen.
                <br />
                <br />
                Das <strong>untere Diagramm</strong> zeigt die Anzahl aller Fälle pro Cluster oder Ausbruch, abhängig
                von der gewählten Einfärbung.
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
        spotlightClicks: true,
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
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-overview-nav']",
        title: "Die Ausbruchsanalysen.",
        content: (
            <p>
                Unter dem Reiter Ausbruchsanalyse finden Sie eine Auflistung Ihrer angelegten Ausbruchsanalysen. Sie
                können hier neue Ausbruchsanalysen anlegen, umbennen oder löschen.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        disableScrolling: true,
        data: {
            next: "/outbreak-analysis",
            prev: null,
        },
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-overview']",
        title: "Die Übersicht über alle Ausbruchsanalysen.",
        content: (
            <p>
                Hier sehen Sie alle angelegten Analysen in einer Tabelle. Sie können nach Analysen suchen, diese
                bearbeiten, löschen oder neue Analysen anlegen.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        disableScrolling: true,
        data: {
            next: null,
            prev: "/",
        },
        styles: {
            spotlight: {
                marginTop: 19,
            },
        },
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-overview-start']",
        title: "Analyse starten.",
        content: (
            <p>
                Im nächsten Schritt zeigen wir Ihnen wie Sie eine Ausbruchsanalyse durchführen können. Dafür starten wir
                eine Beispielanalyse mit dem Namen <strong>Schule A</strong>
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        disableScrolling: true,
        data: {
            next: "/outbreak-analysis/1",
            prev: null,
        },
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-outbreak-selection']",
        title: "Schritt 1 - Die Ausbruchsauswahl.",
        content: (
            <p>
                Jede Analyse startet mit der Auswahl eines Ausbruchs. Hier wurde Ausbruch <strong>Schule A</strong>{" "}
                ausgewählt.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        disableScrolling: true,
        data: {
            next: null,
            prev: "/outbreak-analysis",
        },
        placement: "right",
        styles: {
            spotlight: {
                marginTop: 2,
            },
        },
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-background-selection']",
        title: "Schritt 2 - Die Hintergrunddaten.",
        content: (
            <p>
                Sie können entweder <strong>alle vorhandenen Fälle</strong> als Hintergrunddaten verwenden,{" "}
                <strong>keine Fälle </strong>
                auswählen oder <strong>spezielle Falldaten</strong> aus anderen Ausbrüchen oder Gruppen nutzen.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        disableScrolling: true,
        data: {
            next: null,
            prev: null,
        },
        placement: "right",
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-background-filtering']",
        title: "Schritt 3 - Hintergrunddaten filtern.",
        content: (
            <>
                <p>
                    In diesem Schritt können Sie die Hintergunddaten weiter nach verschiedenen Kriterien filtern.{" "}
                    <strong>Fälle aus dem ausgewählten Ausbruch werden nicht beeinflusst.</strong>
                </p>
                <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-4 ">
                    <div className="space-y-2">
                        <p>
                            <strong>Nicht sequenzierte Fälle ausschließen:</strong> Blendet alle Fälle ohne genetische
                            Sequenzen aus.
                        </p>
                        <p>
                            <strong>Sequenzierte Fälle mit genetischer Distanz &gt; 1 ausschließen:</strong> Blendet
                            alle Fälle mit einer genetischen Distanz über einem festgelegten Schwellenwert aus.
                        </p>
                        <p>
                            <strong>Zeitspanne auswählen:</strong> Blendet alle Fälle außerhalb einer Zeitspanne aus.
                        </p>
                    </div>
                </div>
            </>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        disableScrolling: false,
        data: {
            next: null,
            prev: null,
        },
        placement: "right",
    },
];
