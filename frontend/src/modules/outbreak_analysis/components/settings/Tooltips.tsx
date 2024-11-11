export const tooltipOutbreakSelection = <p>Bitte wählen Sie den Ausbruch aus, den Sie analysieren möchten.</p>;

export const tooltipBackgroundSelection = (
    <p>
        Sie können entweder <strong>alle vorhandenen Fälle</strong> als Umgebungsdaten verwenden,{" "}
        <strong>keine Fälle </strong>
        auswählen oder <strong>spezielle Falldaten</strong> aus anderen Ausbrüchen oder Kategorien nutzen.
    </p>
);

export const tooltipCaseFilter = (
    <>
        <p>
            In diesem Schritt können Sie die Hintergunddaten weiter nach verschiedenen Kriterien filtern.{" "}
            <strong>Fälle aus dem ausgewählten Ausbruch werden nicht beeinflusst.</strong>
        </p>
        <div className="p-4 bg-gray-100 rounded-lg shadow-md mt-4 ">
            <div className="space-y-2">
                <p>
                    <strong>Nicht sequenzierte Fälle ausschließen:</strong> Blendet alle Fälle ohne genetische Sequenzen
                    aus.
                </p>
                <p>
                    <strong>Sequenzierte Fälle mit genetischer Distanz &gt; 1 ausschließen:</strong> Blendet alle Fälle
                    mit einer genetischen Distanz über einem festgelegten Schwellenwert aus.
                </p>
                <p>
                    <strong>Zeitspanne auswählen:</strong> Blendet alle Fälle außerhalb einer Zeitspanne aus.
                </p>
            </div>
        </div>
    </>
);

export const tooltipContactTracing = (
    <p>
        Hier können Sie einstellen, ob die Kontaktnachverfolungsdaten miteinbezogen werden sollen. Abhängig davon werden
        dann entsprechende Kontaktkanten zwischen den Knoten angezeigt.
    </p>
);

export const tooltipColorSelection = (
    <p>
        Über diese Einstellung können Sie die Knoten des Graphen einfärben. Dabei haben Sie die Wahl zwischen einer
        Einfärbung nach der <strong>Zeitspanne</strong> oder nach <strong>Ausbrüchen</strong>. Wenn Sie die Knoten nach
        Ausbrüchen einfärben, können Sie die Farbe jedes Ausbruchs durch einen Klick auf das Farbfeld auf der rechten
        Seite ändern.
    </p>
);
