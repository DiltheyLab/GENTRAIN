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
                    Alle in das Dashboard importierten Falldaten und Fall-assoziierten Daten (mit Ausnahme von Sequenzdaten, siehe unten) werden lokal im Browser des Benutzers gespeichert und nicht an an einen zentralen Server übermittelt oder zentral gespeichert. Eine Übermittlung dieser Daten über das Internet findet prinzipiell nicht statt. Vom Benutzer importierte Sequenzdaten werden, zusammen mit einem zufällig im lokalen Browser des Benutzers generierten Pseudonym, zur Verarbeitung an einen separaten Server übermittelt und zwischengespeichert. Spätestens 30 Minuten nach Übermittlung werden alle auf dem separaten Server zwischengespeicherten Daten gelöscht.
                </p>
            </div>
        </div>
    );
}