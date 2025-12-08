---
id: security-and-data-privacy
title: Informationssicherheit und Datenschutz
sidebar_label: Informationssicherheit und Datenschutz
sidebar_position: 5
---

# Informationssicherheit und Datenschutz

## Verarbeitete Daten

Gentrain verarbeitet personenbezogene Daten ausschließlich auf der Client-Seite. Personenbezogene Daten werden über Fallimporte hinzugefügt und im IndexedDB des Browsers gespeichert. Die Daten beziehen sich nicht auf den Benutzer selbst, sondern auf die Personen, die mit den bei den Gesundheitsämtern registrierten Fällen verknüpft sind.

| Name                         | Beschreibung                                                                                                                                                                                                                                                                                          | Quelle          | Serverseitige Speicherung       | Serverseitige Verarbeitung | Clientseitige Speicherung | Clientseitige Verarbeitung |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------- | -------------------------- | ------------------------- | -------------------------- |
| **Fall ID**                  | Eindeutige Kennung eines beim zuständigen Gesundheitsamt registrierten Falls. Wird verwendet, um Fälle zu identifizieren und Sequenzen den zugehörigen Fällen zuzuordnen.                                                                                                                              | SurvNet, Octoware, ISGA         | ❌                            | ❌                         | ✅                        | ✅                         |
| **Vorname**                  | Vorname einer Person, die mit einem Fall verknüpft ist. Unterstützt die Fallzuordnung in Ausbruchsanalysen.                                                                                                                                                                                           | SurvNet, Octoware, ISGA         | ❌                            | ❌                         | ✅                        | ✅                         |
| **Nachname**                 | Nachname einer Person, die mit einem Fall verknüpft ist. Unterstützt die Fallzuordnung in Ausbruchsanalysen.                                                                                                                                                                                          | SurvNet, Octoware, ISGA         | ❌                            | ❌                         | ✅                        | ✅                         |
| **Adresse**                  | Adresse einer Person, die mit einem Fall verknüpft ist. Unterstützt die Fallzuordnung in Ausbruchsanalysen.                                                                                                                                                                                          | SurvNet, Octoware, ISGA         | ❌                            | ❌                         | ✅                        | ✅                         |
| **Registrierungsdatum**      | Datum, an dem ein Fall beim zuständigen Gesundheitsamt registriert wurde. Unterstützt die Fallzuordnung in Ausbruchsanalysen und das Filtern der in Diagrammen dargestellten Fälle.                                                                                                                 | SurvNet, Octoware, ISGA         | ❌                            | ❌                         | ✅                        | ✅                         |
| **Ausbruchsname**            | Mit einem importierten Fall verknüpfter Ausbruch. Dient der Darstellung in Diagrammen und zum Filtern.                                                                                                                                                                                               | SurvNet, Octoware, ISGA         | ❌                            | ❌                         | ✅                        | ✅                         |
| **Kontaktinformationen**     | Verknüpfung zwischen zwei Fällen und deren Art des Kontakts. Unterstützt die Ausbruchsanalysen, indem sie zusätzliche Informationen über Infektionsvorkommen liefert.                                                                                                                                | SurvNet, Octoware, ISGA         | ❌                            | ❌                         | ✅                        | ✅                         |
| **Fasta ID**                 | Kennung einer Sequenz, die einem importierten Fall zugeordnet ist. Dient der Identifizierung von Sequenzen und der Zuordnung von Fällen zu importierten Sequenzen. Auf der Serverseite werden Sequenzen über Pseudonyme identifiziert, die zuerst auf der Client-Seite erstellt werden, um Pseudonyme und Fasta IDs kontinuierlich zuzuordnen. | Sequencing Labs | ❌                            | ❌                         | ✅                        | ✅                         |
| **Genetische Sequenzen**     | Sequenzen, die mit importierten Fällen verknüpft sind. Sie dienen der Berechnung genetischer Abstände zwischen Fällen, die wiederum Ausbruchsanalysen unterstützen.                                                                                                                                | Sequencing Labs | ❌                            | ✅                         | ❌                        | ✅                         |
| **Ergebnis der Sequenzanalyse** | Sequenzen werden auf Mutationen basierend auf dem entsprechenden Referenzgenom analysiert. Diese Ergebnisse werden serverseitig maximal 30 Minuten gespeichert, falls Benutzer die Websocket-Verbindung schließen (z. B. durch Schließen des Browser-Tabs) und die Ergebnisse nicht sofort abrufen können. | Intern          | ✅ <small>(temporär)</small> | ✅                         | ✅                        | ✅                         |

Genetische Daten, wie Virus- und Bakteriengenome, werden an den Server übertragen, und Analyseergebnisse werden temporär für maximal 30 Minuten gespeichert.  
Diese enthalten Informationen über Mutationen basierend auf dem entsprechenden Referenzgenom.  
Bei der Kommunikation mit dem Server werden Sequenzen aggregiert und anonymisiert, wobei nur ein Hash als Referenz dient. 

Es ist auch möglich, flexible Daten-Spalten zum Fallimport hinzuzufügen. Diese Daten werden zum Filtern von Diagrammen genutzt und nur auf der Client-Seite gespeichert und verarbeitet.

## Datenverarbeitungsoperationen

| Operation                                                | Beschreibung                                                                                                       | Daten                                              | Zweck                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Datenimport**                                          | Import von Daten aus Fasta- / CSV-Dateien                                                                          | Fälle, Sequenzen, Kontakte                        | Datenbasis für Ausbruchsanalysen                                                  |
| **Clientseitige Speicherung importierter Daten**        | Speicherung von Daten aus Fasta- / CSV-Dateien                                                                    | Fälle, Sequenzen, Kontakte                        | Datenbasis für Ausbruchsanalysen                                                  |
| **Datenbankexport**                                      | Export von in IndexedDB gespeicherten Daten                                                                       | Clientseitiger Anwendungszustand                  | Persistente Datenverwaltung, Zustandsfreigabe, Backups                             |
| **Datenbankimport**                                      | Import von in IndexedDB gespeicherten Daten                                                                       | Clientseitiger Anwendungszustand                  | Persistente Datenverwaltung, Zustandsfreigabe, Backups                             |
| **Sequenzanalyse**                                       | Websocket-Kommunikation zwischen Client und Server                                                                | Pseudonymisierte Sequenzdaten, Mutationsinformationen | Analyse von Mutationen, um relevante Sequenzinformationen komprimiert zu speichern |
| **Clientseitige Speicherung der Analyseergebnisse**     | Speicherung in IndexedDB                                                                                           | Mutationsinformationen                             | Berechnung von Abständen zwischen Sequenzen                                        |
| **Serverseitiges Caching der Analyseergebnisse**        | Temporäre Speicherung im Redis-Cache (max. 30 Minuten)                                                            | Mutationsinformationen                             | Ergebnisse bei Verlassen der Anwendung durch den Benutzer zwischenspeichern        |
| **Serverseitiges Caching von Sequenzchunks**            | Temporäre Speicherung im Redis-Cache (bis alle Chunks übertragen wurden oder max. 30 Minuten)                      | Pseudonymisierte Sequenzen, pseudonymisierte Assemblies | Zuverlässige Websocket-Übertragung trotz großer Datenmengen                        |
| **Export des Ausbruchsberichts**                         | Export einer Ausbruchsanalysen mit Fall-, Sequenz- und Kontaktinformationen in Form einer PDF-Datei                | Fälle, Sequenzen, Kontakte                        | Sammlung und Export von Ausbruchsanalysen und deren Ergebnissen                     |

## Absicherung der Postgres-Datenbank

Der Docker-Container, der die Postgres-Instanz ausführt, läuft als Nicht-Root-Benutzer. Der Zugriff auf die Datenbank erfordert Authentifizierung.

## Absicherung von Redis

Die offizielle <a href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/" target="_blank">'Redis-Sicherheitsrichtlinie'</a> wurde konsequent befolgt, mit Ausnahme der TLS-Verschlüsselung, da der `gentrain-redis` Container nur vom lokalen Docker-Netzwerk aus zugänglich ist.  
Der Docker-Container, der Redis ausführt, läuft als Nicht-Root-Benutzer, und die Legacy-Authentifizierung ist aktiviert. Außerdem ist die lokale Docker-IP-Adresse gebunden, um Zugriffe von anderen Quellen zu verhindern. ACL-Regeln wurden für gefährliche Befehle konfiguriert:

- alle Befehle außer gefährlichen (-@dangerous) sind erlaubt  
- die Befehle `+client|list` und `+keys` sind explizit erlaubt, da python-rq diese nutzt

## Absicherung des Admin-Panels

### Authentifizierung

Um auf das GENTRAIN Admin-Panel zuzugreifen, müssen sich Benutzer authentifizieren. Verschiedene Rollen wurden implementiert, um nur bestimmten Benutzern die Benutzerverwaltung zu erlauben.

Admin-Passwörter müssen beim ersten Login gesetzt werden und folgende Regeln erfüllen:

- mindestens 8 Zeichen  
- mindestens 1 Zahl  
- mindestens 1 Sonderzeichen ($, #, @, !, \*, .)  

### Datei-Uploads

Der Zugriff auf andere Verzeichnisse als die angegebenen Upload-Standorte ist für den Ubuntu-Benutzer, der das Admin-Panel ausführt, nicht erlaubt. Hochgeladene Dateien werden zudem strikt anhand der erwarteten Dateimuster überprüft.

## Absicherung der Websocket-Verbindung

Die WebSocket-Kommunikation ist TLS-verschlüsselt.
