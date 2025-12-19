export function DataPrivacy() {
    return (
        <div className="flex flex-1 flex-col space-y-3 p-5">
            <h1 className="text-2xl font-bold tracking-tight mb-4">Datenschutzhinweise für das Dashboard „Gentrain“</h1>
            <div>
                <p>
                    Wir nehmen den Schutz Ihrer personenbezogenen Daten sehr ernst. Wir möchten Ihnen mit diesen
                    Datenschutzhinweisen daher einen Überblick darüber geben, welche Art von Daten zu welchem Zweck
                    erhoben werden und wie sie verwendet werden.
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">1. Verantwortlicher</h2>
                <p>
                    Für die Datenverarbeitung im Zusammenhang mit der Bereitstellung der Webanwendung Dashboard
                    „Gentrain“ (https://{import.meta.env.VITE_APP_URL}) ist verantwortlich:
                </p>
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
                    E-Mail-Adresse:{" "}
                    <a className="underline" href="mailto:info@med.uni-duesseldorf.de">
                        info@med.uni-duesseldorf.de
                    </a>
                    <br />
                    Telefon: 00 49 (0) 2 11 - 81 00
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">2. Datenschutzbeauftragte/r</h2>
                <p>
                    <strong>Stabsstelle Datenschutz:</strong>
                    <br />
                    Datenschutzbeauftragte UKD
                    <br />
                    Moorenstraße 5
                    <br />
                    40225 Düsseldorf
                    <br />
                    E-Mail-Adresse:{" "}
                    <a className="underline" href="mailto:Datenschutz@med.uni-duesseldorf.de">
                        Datenschutz@med.uni-duesseldorf.de
                    </a>
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">3. Kategorien von betroffenen Personen</h2>
                <p>
                    Jede/jeder Besucherin oder Besucher der Website. Inkl. Mitarbeitende eines Gesundheitsamtes als
                    Besucherinnen/Besucher.
                </p>
            </div>
            <div className="flex flex-col space-y-3">
                <h2 className="font-bold text-lg -mb-2">
                    4. Datenverarbeitung im Rahmen der Bereitstellung des Dashboards
                </h2>
                <p>
                    <u>
                        Beim Besuch und Nutzung der Web-Anwendung Dashboard „Gentrain“ werden folgende Metadaten
                        verarbeitet, die Personenbezug enthalten können:
                    </u>
                </p>
                <ul className="list-disc ml-6">
                    <li>IP-Adresse</li>
                    <li>Datum und Uhrzeit des Abrufs</li>
                    <li>Name des aufgerufenen Internetdienstes, aufgerufenen Ressource und der verwendeten Aktion</li>
                    <li>Abfrage, die der Client gestellt hat</li>
                    <li>übertragene Datenmenge</li>
                    <li>Meldung, ob der Abruf erfolgreich war</li>
                    <li>Browser-Identifikation (enthält in der Regel die Browserversion sowie das Betriebssystem)</li>
                </ul>
                <p>
                    <u>Zweck der Datenverarbeitung:</u> Bereitstellung der bestimmungsgemäßen Funktionalität des
                    Dashboards.
                </p>
                <p>
                    <u>Rechtsgrundlagen der Datenverarbeitung:</u> Die Verarbeitung personenbezogener Daten im Rahmen
                    der Nutzung des Dashboards, um in Folgeschritten die Ausbruchsanalyse auf Basis von Infektionsketten
                    durchzuführen, beruht auf Art. 6 Abs. 1 S. 1 lit. b) DSGVO. Im Falle eines Besuchs der Startseite
                    des Dashboards durch Dritte erfolgt die Verarbeitung von personenbezogenen Daten im Rahmen der
                    Zutrittsprüfung auf Basis von Art. 6 Abs. 1 lit. f) DSGVO.
                </p>
                <p>
                    <u>Pflicht zur Bereitstellung der Daten und Folgen, wenn die Daten nicht bereitgestellt werden:</u>{" "}
                    Eine gesetzliche Verpflichtung zur Verarbeitung von personenbezogenen Daten besteht nicht.
                    Allerdings ist eine Nutzung des Dashboards ohne Bereitstellung der Informationen technisch nicht
                    möglich.
                </p>
                <p>
                    <u>Löschung der Daten:</u> Die Daten werden nur so lange verarbeitet, bis der Server die Anfrage
                    beantwortet. Nach der Bearbeitung der Anfrage verfallen die Daten. Demnach findet Server-seitig
                    keine Persistierung der Daten statt.
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">5. Empfänger Ihrer Daten</h2>
                <p>
                    Zur Bereitstellung des Dashboards setzt der Verantwortliche folgende IT-Dienstleister als
                    Auftragsverarbeiter ein:
                </p>
                <ul>
                    <li>de.NBI Cloud in Bielefeld</li>
                </ul>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">6. Ihre Rechte</h2>
                <p>
                    Sie können als Betroffene oder Betroffener gegenüber dem datenschutzrechtlichen Verantwortlichen die
                    nachfolgend benannten Rechte geltend machen.
                </p>
                <h3 className="font-bold mb-1 mt-3">6.1 Recht auf Auskunft und Kopie</h3>
                <p>
                    Sie können vom Verantwortlichen gemäß Art. 15 DSGVO Auskunft darüber verlangen, ob er Sie
                    betreffende personenbezogene Daten verarbeitet. Ist dies der Fall, können Sie die in Art. 15 DSGVO
                    genannten Informationen über die Datenverarbeitung verlangen. Auf Ihren Wunsch stellt der
                    Verantwortliche eine Kopie der verarbeiteten personenbezogenen Daten zur Verfügung.
                </p>
                <h3 className="font-bold mb-1 mt-3">6.2 Recht auf Berichtigung</h3>
                <p>
                    Sie können vom Verantwortlichen gemäß Art. 16 DSGVO verlangen, dass er Sie betreffende unrichtige
                    personenbezogene Daten berichtigt oder ggf. unvollständige personenbezogene Daten ergänzt.
                </p>
                <h3 className="font-bold mb-1 mt-3">6.3 Recht auf Löschung</h3>
                <p>
                    Sie können vom Verantwortlichen gemäß Art. 17 DSGVO verlangen, dass er Sie betreffende
                    personenbezogene Daten löscht, sofern die in Art. 17 DSGVO genannten Voraussetzungen vorliegen.
                </p>
                <h3 className="font-bold mb-1 mt-3">6.4 Recht auf Einschränkung der Verarbeitung</h3>
                <p>
                    Sie können vom Verantwortlichen gemäß Art. 18 DSGVO verlangen, dass die Verarbeitung Ihrer
                    personenbezogenen Daten eingeschränkt wird, sofern die in Art. 18 DSGVO genannten Voraussetzungen
                    vorliegen.
                </p>
                <h3 className="font-bold mb-1 mt-3">6.5 Recht auf Datenübertragbarkeit</h3>
                <p>
                    Sie können vom Verantwortlichen gemäß Art. 20 DSGVO verlangen, dass er Ihnen Ihre personenbezogenen
                    Daten in einem strukturierten, gängigen und maschinenlesbaren Format bereitstellt. Sie haben das
                    Recht, diese Daten einem anderen Verantwortlichen zu übermitteln. Dies gilt jeweils nur, wenn die
                    Verarbeitung auf einer Einwilligung beruht und die Verarbeitung mittels automatisierter Verfahren
                    erfolgt.
                </p>
                <h3 className="font-bold mb-1 mt-3">6.6 Recht zum Widerspruch gegen die Verarbeitung</h3>
                <p>
                    Sie können aus Gründen, die sich aus Ihrer besonderen Situation ergeben, bei dem Verantwortlichen
                    gemäß Art. 21 DSGVO Widerspruch gegen die Verarbeitung Sie betreffender personenbezogener Daten, die
                    auf der Rechtsgrundlage des Art. 6 Abs. 1 UAbs. 1 lit. e DSGVO erfolgt, einlegen. Der
                    Verantwortliche verarbeitet dann die personenbezogenen Daten nicht mehr, es sei denn, er kann
                    darlegen und ggf. nachweisen, dass die Voraussetzungen für eine Fortführung der Verarbeitung dieser
                    Daten gemäß Art. 21 DSGVO vorliegen.
                </p>
                <h3 className="font-bold mb-1 mt-3">6.7 Recht zur Beschwerde bei der Datenschutzaufsichtsbehörde</h3>
                <p>
                    Sie können jederzeit eine Beschwerde über die Verarbeitung Sie betreffender personenbezogener Daten
                    durch den Verantwortlichen bei der zuständigen Datenschutzaufsichtsbehörde einreichen.
                </p>
                <p className="mt-2">
                    <strong>Zuständige Aufsichtsbehörde ist:</strong>
                    <br />
                    Landesbeauftragte für Datenschutz und Informationsfreiheit
                    <br />
                    Nordrhein-Westfalen
                    <br />
                    Postfach 20 04 44
                    <br />
                    40102 Düsseldorf
                    <br />
                    Telefon: 0211/38424-0
                    <br />
                    Telefax: 0 211/38424 - 999
                    <br />
                    E-Mail:{" "}
                    <a className="underline" href="mailto:poststelle@ldi.nrw.de">
                        poststelle@ldi.nrw.de
                    </a>
                    <br />
                    <a className="underline" href="https://www.ldi.nrw.de">
                        www.ldi.nrw.de
                    </a>
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">
                    7. Verantwortlichkeit im Rahmen des Datenimports ins Dashboard
                </h2>
                <h3 className="font-bold mb-1 mt-3">
                    7.1 Durchführung der Ausbruchsanalyse auf Basis der Infektionsketten durch Mitarbeitende der
                    Gesundheitsämter
                </h3>
                <p>
                    Sofern Sie als Mitarbeitende/r eines Gesundheitsamtes mittels des Dashboards die Ausbruchsanalyse
                    auf Basis der Infektionsketten durchführen, müssen Sie die bei Ihrem Gesundheitsamt vorhanden Fall-,
                    Kontakt-, Sequenzdaten ins Dashboard importieren. Die personenbezogenen Daten bleiben ausschließlich
                    lokal in Ihrem Browser gespeichert und werden nicht ans Universitätsklinikum Düsseldorf übermittelt.
                    Für diese Daten bleibt Ihr Gesundheitsamt eigenständig i.S.v. Art. 4 Nr. 7 DSGVO verantwortlich.
                    Dementsprechend muss Ihr Gesundheitsamt seinen Datenschutzpflichten eigenständig nachkommen. Als
                    Mitarbeitende/r müssen Sie daher alle Datenschutzvorgaben Ihres Gesundheitsamtes im Rahmen der
                    Nutzung dieses Dashboards zur Durchführung der Ausbruchsanalyse auf Basis der Infektionsketten
                    einhalten. Insbesondere müssen Sie auf die rechtzeitige Löschung der ins Dashboard importierten
                    Daten, die lokal in Ihrem Browser gespeichert bleiben, achten. Für die endgültige Löschung der Daten
                    aus Ihrem Browser müssen Sie den Button „Alle Daten löschen“ im Dashboard anklicken.
                </p>
                <h3 className="font-bold mb-1 mt-3">7.2 Datenimport durch zufällige Besucherinnen/Besucher</h3>
                <p>
                    Das Dashboard ist darauf ausgelegt, es den Gesundheitsämtern zu ermöglichen, eine digital-basierte
                    Ausbruchsanalyse auf Basis der Infektionsketten durchzuführen. Die Nutzung des Dashboards für andere
                    Zwecke ist nicht vorgesehen. Sofern Sie als zufällige/r Besucherin/Besucher den Datenimport ins
                    Dashboard vornehmen, tragen Sie für die Verarbeitung der importierten personenbezogenen Daten die
                    Verantwortung i.S.v. DSGVO, da diese Daten, lokal in Ihrem Browser gespeichert bleiben und ans
                    Universitätsklinikum Düsseldorf nicht übertragen werden.
                </p>
            </div>
            <div>
                <h2 className="font-bold text-lg mb-1">8. Änderungen der Datenschutzhinweise</h2>
                <p>
                    Wir behalten uns das Recht vor, diese Datenschutzhinweise jederzeit unter Beachtung der geltenden
                    Datenschutzvorschriften zu ändern. Derzeitiger Stand ist Dezember 2025.
                </p>
            </div>
        </div>
    );
}
