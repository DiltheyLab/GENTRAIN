export function DataPrivacy() {
    return (
        <div className={"px-5 py-10"}>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Datenschutz</h2>
            <div className="mb-4">
                <h3 className={"font-bold text-lg mb-1"}>
                    Datenspeicherung
                </h3>
                <p>
                    Sequenzdaten werden zur Verarbeitung an einem seperaten Server übermittelt und zwischengespeichert.
                    Diese Daten werden nach spätestens 30 Minuten wieder entfernt.
                </p>
                <p>Alle anderen in das Dashboard importierten Daten werden lokal gespeichert.
                </p>
            </div>
            <div className="mb-4">
                <h3 className={"font-bold text-lg mb-1"}>
                    Erhebung von Zugriffsdaten und Logfiles
                </h3>
                <p>
                    Der Zugriff auf unser Onlineangebot wird in Form von so genannten "Server-Logfiles" protokolliert.
                    Zu den Serverlogfiles können die Adresse und Name der abgerufenen Webseiten und Dateien, Datum und
                    Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst
                    Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall
                    IP-Adressen und der anfragende Provider gehören. Die Serverlogfiles können zum einen zu Zwecken der
                    Sicherheit eingesetzt werden, z.B., um eine Überlastung der Server zu vermeiden (insbesondere im
                    Fall von missbräuchlichen Angriffen, sogenannten DDoS-Attacken) und zum anderen, um die Auslastung
                    der Server und ihre Stabilität sicherzustellen; <strong>Rechtsgrundlagen:</strong> Berechtigte
                    Interessen (Art. 6
                    Abs. 1 S. 1 lit. f) DSGVO); <strong>Löschung von Daten:</strong> Logfile-Informationen werden für
                    die Dauer von
                    maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert. Daten, deren weitere
                    Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung des jeweiligen
                    Vorfalls von der Löschung ausgenommen.
                </p>
            </div>


        </div>
    );
}