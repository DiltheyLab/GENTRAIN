export function Impress() {
    return (
        <div className="flex flex-1 flex-col space-y-3 p-5">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Impressum</h1>
            <div>
                <p>
                    <strong>Universitätsklinikum Düsseldorf</strong>
                    <br />
                    Anstalt des öffentlichen Rechts
                    <br />
                    Moorenstr. 5
                    <br />
                    40225 Düsseldorf
                </p>
                <p>
                    Tel.: 00 49 (0) 2 11 - 81 00
                    <br />
                    E-Mail:{" "}
                    <a className="underline" href="mailto:info@med.uni-duesseldorf.de">
                        info@med.uni-duesseldorf.de
                    </a>
                </p>
                <p>
                    <strong>Umsatzsteuer-Identifikationsnummer</strong> gemäß § 27 a Umsatzsteuergesetz: DE119432190
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">Vorstand</h2>
                <p>
                    Professorin Dr. Kirsten Schmieder, Ärztliche Direktorin, Vorstandsvorsitzende
                    <br />
                    Thorsten Münse, Komm. Kaufmännischer Direktor und stellv. Vorstandsvorsitzende
                    <br />
                    Professor Dr. Sascha Dietrich, stellv. Ärztlicher Direktor
                    <br />
                    Torsten Rantzsch, Pflegedirektor
                    <br />
                    Professor Dr. Nikolaj Klöcker, Dekan der Medizinischen Fakultät
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">Zuständige Aufsichtsbehörde</h2>
                <p>
                    Ministerium für Kultur und Wissenschaft (MKW) des Landes Nordrhein-Westfalen, Völklinger Str. 49,
                    40221 Düsseldorf, Deutschland <br />
                    <a className="underline" href="https://www.mkw.nrw">
                        https://www.mkw.nrw
                    </a>
                    <br />
                    Bei Fragen und Hinweisen zum Internetangebot des Universitätsklinikums Düsseldorf wenden Sie sich
                    bitte an Tobias Pott,{" "}
                    <a
                        className="underline"
                        href="https://www.uniklinik-duesseldorf.de/ueber-das-ukd/unternehmen/vorstand/stabstellen-des-vorstandes/unternehmenskommunikation"
                    >
                        Stabsstelle Unternehmenskommunikation
                    </a>
                    .
                </p>
            </div>

            <div>
                <h2 className="font-bold text-lg mb-1">Haftungsausschluss</h2>
                <p>
                    Die Informationen dieses Internetauftritts wurden nach bestem Wissen und Gewissen sorgfältig
                    zusammengestellt und geprüft. Es wird jedoch keine Gewähr – weder ausdrücklich noch stillschweigend
                    – für die Vollständigkeit, Richtigkeit oder Aktualität sowie die jederzeitige Verfügbarkeit der
                    bereit gestellten Informationen übernommen. Eine Haftung für Schäden, die aus der Nutzung oder
                    Nichtnutzung der auf dieser Website angebotenen Informationen entstehen ist – soweit gesetzlich
                    zulässig – ausgeschlossen.
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">Urheberrecht</h2>
                <p>
                    Die auf dieser Website veröffentlichten Inhalte (Layout, Texte, Bilder, Grafiken, Video- und
                    Tondateien usw.) unterliegen dem Urheberrecht. Jede vom Urheberrechtsgesetz nicht zugelassene
                    Verwertung bedarf vorheriger ausdrücklicher Zustimmung des Universitätsklinikums Düsseldorf. Dies
                    gilt insbesondere für Vervielfältigung, Bearbeitung, Übersetzung, Einspeicherung, Verarbeitung bzw.
                    Wiedergabe von Inhalten in Datenbanken oder anderen elektronischen Medien und Systemen. Fotokopien
                    und Downloads von Web-Seiten für den privaten, wissenschaftlichen und nicht kommerziellen Gebrauch
                    dürfen hergestellt werden.
                </p>
            </div>
        </div>
    );
}
