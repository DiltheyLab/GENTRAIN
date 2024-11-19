export function Impress() {
    return (
        <div className={"px-5 py-10"}>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Impressum</h2>
            <div className="mb-4">
                <h3 className={"font-bold text-lg mb-1"}>
                    Universitätsklinikum Düsseldorf</h3>
                <p>Anstalt des öffentlichen Rechts</p>
                <p>Moorenstr. 5</p>
                <p className={"mb-2"}>40225 Düsseldorf</p>
                <p>Tel.: 00 49 (0) 2 11 - 81 00</p>
                <p>Fax: 00 49 (0) 2 11 - 81 04 855</p>
            </div>
            <div className="mb-4">
                <h3 className={"font-bold text-lg mb-1"}>
                    Vorstand
                </h3>
                <p>
                    Professorin Dr. Kirsten Schmieder, Ärztliche Direktorin, Vorstandsvorsitzende<br/>
                    Thorsten Münse, Komm. Kaufmännischer Direktor und stellv. Vorstandsvorsitzende<br/>
                    Professor Dr. Benedikt Pannen, stellv. Ärztlicher Direktor<br/>
                    Torsten Rantzsch, Pflegedirektor<br/>
                    Professor Dr. Nikolaj Klöcker, Dekan der Medizinischen Fakultät<br/>
                </p>
            </div>
            <div className="mb-4">
                <h3 className={"font-bold text-lg mb-1"}>
                    Zuständige Aufsichtsbehörde
                </h3>
                <p>Ministerium für Kultur und Wissenschaft des Landes
                    Nordrhein-Westfalen,
                    40190 Düsseldorf
                </p>
            </div>

        </div>
    )
        ;
}