import { Step } from "react-joyride";

export const tutorialSteps: Step[] = [
    // ------------------------------DASHBOARD--------------------------------
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
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
    },
    {
        target: "[data-tutorial-tour-step='dashboard-visualization-panel']",
        title: "Der Graph.",
        content: (
            <>
                <p className="mb-4 -mt-3">
                    Zu den hochgeladenen Falldaten und deren genetischen Sequenzen berechnen wir die genetischen
                    Distanzen und zeigen alle Daten in einem minimalen Spannbaum an.{" "}
                    <strong>
                        Die Knoten repräsentieren dabei die Fälle und die grauen Kanten die genetischen Distanzen (keine
                        Übertragungsevents).
                    </strong>
                </p>
                <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-2 2xl:hidden">Interaktionen</h2>
                    <h2 className="text-lg font-bold mb-2 hidden 2xl:block">Interaktionen mit dem Graphen</h2>
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
            <>
                <p>Hier sehen Sie Informationen über Knoten und Kanten des Graphen.</p>
                <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-2">
                    <p>
                        Die durchgezogene graue Kante{" "}
                        <span className="inline-block">
                            (<span className="h-[3px] w-5 inline-block bg-[#CCCCCC] mb-1" />)
                        </span>{" "}
                        zeigt genetische Distanzen, die unter einem pathogenabhängigen Schwellenwert liegen. Diese
                        Kanten deuten auf eine direkte Ansteckung mit dem genetisch identischen Erreger hin. Die
                        gestrichelte graue Kante{" "}
                        <span className="inline-block">
                            (
                            <span className="h-[3px] w-6 border-b-[3px] border-[#CCCCCC] border-dashed inline-block mb-1" />
                            )
                        </span>{" "}
                        zeigt genetische Distanzen, die über dem Schwellenwert liegen.
                    </p>
                </div>
            </>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        disableScrolling: true,
        placement: "left-start",
        styles: {
            options: {
                width: "20vw",
            },
            spotlight: {
                cursor: "not-allowed",
            },
        },
        spotlightPadding: 6,
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
        spotlightPadding: 6,
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
                        SARS-CoV-2 kann man bei einer genetischen Distanz ≤ 1 davon ausgehen, dass es sich um eine
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
                    Ihre importierten Daten <strong>verbleiben ausschließlich in Ihrem Browser</strong> und{" "}
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
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
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
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        placement: "bottom",
        disableScrolling: true,
    },
    {
        target: "[data-tutorial-tour-step='data-management-nav']",
        title: "Die Datenverwaltung.",
        content: (
            <p>
                Unter dem Reiter Datenverwaltung finden Sie eine Übersicht aller Daten. Sie können hier Falldaten,
                Sequenzdaten oder Kontaktdaten importieren, ändern und löschen.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        data: {
            next: "/data-management",
        },
    },
    // ------------------------------Data-Management--------------------------------
    {
        target: "[data-tutorial-tour-step='data-management-import']",
        title: "Der Datenimport.",
        content: (
            <p>
                Hier können Sie entweder manuell <strong>Falldaten, Sequenzdaten und Kontaktdaten</strong> importieren
                oder den Import-Assistenten verwenden, der Sie durch den Importprozess führt und Ihnen mehr
                Informationen zu den einzelnen Daten liefert.{" "}
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: false,
        data: {
            prev: "/",
        },
    },
    {
        target: "[data-tutorial-tour-step='data-management-case-section']",
        title: "Ihre Datenübersicht.",
        content: <p>In diesem Bereich finden Sie eine Übersicht über alle importierten Daten.</p>,
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: false,
        floaterProps: {
            options: {
                preventOverflow: {
                    boundariesElement: "viewport",
                },
            },
            offset: 60,
        },
    },
    {
        target: "[data-tutorial-tour-step='data-management-outbreak-section']",
        title: "Ihre Ausbrüche.",
        content: (
            <p>
                Diese Tabelle listet alle von Ihnen angelegten Ausbrüche auf. Sie können hier{" "}
                <strong>neue Ausbrüche erstellen</strong> und diesen <strong>Fälle zuordnen.</strong>
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: false,
        placement: "auto",
        floaterProps: {
            options: {
                preventOverflow: {
                    boundariesElement: "viewport",
                },
            },
        },
    },
    {
        target: "[data-tutorial-tour-step='data-management-group-section']",
        title: "Ihre Gruppen.",
        content: <p>Hier finden Sie Informationen zu allen angelegten Gruppen. </p>,
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: false,
        floaterProps: {
            options: {
                preventOverflow: {
                    boundariesElement: "viewport",
                },
            },
        },
    },
    {
        target: "[data-tutorial-tour-step='data-management-delete-data-section']",
        title: "Alle Daten löschen.",
        content: (
            <p>
                Wenn Sie ihren gesamten Datenbestand löschen wollen, können Sie das hier tun.{" "}
                <strong>Achtung: Dieser Vorgang kann nicht rückgängig gemacht werden!</strong>
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: false,
        placement: "top",
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
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        data: {
            next: "/outbreak-analysis",
        },
    },
    // ------------------------------Outbreak-Analyses-Overview--------------------------------
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-overview']",
        title: "Die Übersicht über alle Ausbruchsanalysen.",
        content: (
            <p>
                Hier sehen Sie alle angelegten Analysen in einer Tabelle. Sie können nach{" "}
                <strong> Analysen suchen, diese bearbeiten, löschen oder neue Analysen anlegen</strong>.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                marginTop: 2,
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        data: {
            prev: "/data-management",
        },
        offset: -10,
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-overview-start']",
        title: "Analyse starten.",
        content: (
            <p>
                Im nächsten Schritt zeigen wir Ihnen wie Sie eine Ausbruchsanalyse durchführen können. Dafür starten wir
                eine Beispielanalyse mit dem Namen <strong>Schule A</strong>.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        data: {
            next: "/outbreak-analysis/1",
        },
    },
    // ------------------------------Outbreak-Analysis--------------------------------
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-outbreak-selection']",
        title: "Schritt 1 - Die Ausbruchsauswahl.",
        content: (
            <p>
                Jede Analyse startet mit der Auswahl eines Ausbruchs. Hier wurde{" "}
                <strong>Ausbruch Schule A ausgewählt</strong>.
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
                cursor: "not-allowed",
            },
        },
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-background-selection']",
        title: "Schritt 2 - Die Umgebung.",
        content: (
            <p>
                Sie können entweder <strong>alle vorhandenen Fälle</strong> als Umgebungsdaten verwenden,{" "}
                <strong>keine Fälle </strong>
                auswählen oder <strong>spezielle Falldaten</strong> aus anderen Ausbrüchen oder Kategorien nutzen.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        placement: "right",
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-case-filtering']",
        title: "Schritt 3 - Fälle filtern.",
        content: (
            <>
                <p>In diesem Schritt können Sie die Fälle weiter nach verschiedenen Kriterien filtern. </p>
                <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-4 ">
                    <div className="space-y-2">
                        <p>
                            <strong>Nicht sequenzierte Fälle ausschließen:</strong> Blendet alle Fälle ohne genetische
                            Sequenzen aus.
                        </p>
                        <p>
                            <strong>Sequenzierte Umgebungsfälle mit genetischer Distanz &gt; 1 ausschließen:</strong>{" "}
                            Blendet alle Umgebungsfälle mit einer genetischen Distanz über einem festgelegten
                            Schwellenwert aus.
                        </p>
                        <p>
                            <strong>Zeitspanne auswählen:</strong> Blendet alle Umgebungsfälle außerhalb einer
                            Zeitspanne aus.
                        </p>
                    </div>
                </div>
            </>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        placement: "right",
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-contact-tracing']",
        title: "Schritt 4 - Die Kontaktnachverfolgung.",
        content: (
            <p>
                Hier können Sie einstellen, ob die Kontaktnachverfolungsdaten miteinbezogen werden sollen. Abhängig
                davon werden dann entsprechende Kontaktkanten zwischen den Knoten angezeigt.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        placement: "right",
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-coloring']",
        title: "Schritt 5 - Die Einfärbung.",
        content: (
            <p>
                Über diese Einstellung können Sie die Knoten des Graphen einfärben. Dabei haben Sie die Wahl zwischen
                einer Einfärbung nach der <strong>Zeitspanne</strong> oder nach <strong>Ausbrüchen</strong>. Über die
                Farbfelder auf der Seite können Sie die Knotenfarbe ändern.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        placement: "right",
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-visualization-panel']",
        title: "Der Graph.",
        content: (
            <p>
                Die Darstellung der Daten erfolgt, wie bereits im Dashboard, als <strong>minimaler Spannbaum</strong>,
                bei dem die Knoten die Fälle repräsentieren und die grauen Kanten die genetischen Distanzen anzeigen.
                Werden Daten aus der Kontaktnachverfolgung genutzt, erscheinen zusätzlich farbige Kontaktkanten, die in
                der Legende erläutert sind. Die Analyse-Einstellungen werden automatisch gespeichert, solange die Option{" "}
                <strong>"Autom. Speichern"</strong> in der unteren linken Ecke aktiviert ist.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: true,
        disableScrolling: true,
        placement: "left-start",
        styles: {
            options: {
                width: "20vw",
            },
            spotlight: {
                marginTop: 5,
            },
        },
    },
    {
        target: "[data-tutorial-tour-step='outbreak-analysis-report-export']",
        title: "Der Analyse-Report.",
        content: (
            <p>
                Sie können einen Ausbruchanalyse-Report zu Ihrem analysierten Ausbruch anfertigen. Im Report finden Sie{" "}
                <strong>eine Zusammenfassung</strong> des Datensatzes und eine{" "}
                <strong>automatisch erzeugte Ergebnisbewertung</strong>. Sie können den Report als PDF exportieren.
            </p>
        ),
        disableBeacon: true,
        spotlightClicks: false,
        styles: {
            spotlight: {
                cursor: "not-allowed",
            },
        },
        disableScrolling: true,
        placement: "top",
    },
    {
        target: "[data-tutorial-tour-step='tutorial-end']",
        title: "Das Tutorial ist beendet.",
        content: (
            <p>
                Sie haben nun alle wichtigen Funktionen von Gentrain kennengelernt. Sie können die Anwendung weiter mit
                den Beispieldaten erkunden oder diese löschen und eigene Daten hochladen.{" "}
                {/* Unter dem Reiter{" "}
                <strong>Hilfe</strong> können Sie das Tutorial jederzeit erneut starten.{" "} */}
                <strong>Wir wünschen Ihnen viel Erfolg bei der Arbeit mit Gentrain!</strong>
            </p>
        ),
        disableBeacon: true,
        placement: "center",
    },
];
