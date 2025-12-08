---
id: general
title: Allgemein
sidebar_label: Allgemein
sidebar_position: 1
---

# Allgemein

Auf der Seite **„Datenverwaltung“** verwalten Sie die lokalen Falldaten für das aktuell ausgewählte Pathogen.  
Hier können Sie Fälle, Sequenzen und Kontaktpersonendaten importieren, eine Übersicht über vorhandene Daten einsehen sowie Daten gezielt löschen oder Ausbrüche erstellen.

Die Seite ist in drei Hauptbereiche gegliedert:

- **Importbereich:** Hochladen neuer Daten (Falldaten, Sequenzdaten, Kontaktpersonendaten)
- **Datenübersicht:** Übersicht aller importierten Fälle, Ausbrüche und Gruppen, inklusive Bearbeitungs- und Löschoptionen
- **Datenlöschung:** Einstellungen zur automatischen Löschung (TTL), temporären Speicherung und manuellen Löschung der gesamten lokalen Datenbank

## Datenimport

Im **Importbereich** können Sie drei Datentypen hochladen: Fall-, Sequenz- und Kontaktdaten.

:::info Wichtige Hinweise

- Sequenz- und Kontaktpersonenimporte sind nur verfügbar, wenn bereits Falldaten für das aktive Pathogen existieren. Importieren Sie zuerst die Falldaten.
- Verwenden Sie das von GENTRAIN erwartete Format. Bei Unsicherheit können Sie die **exemplarischen Falldaten** verwenden, welche wir Ihnen unter den Import-Boxen zur Verfügung stellen.
  :::
  

**Schritte für den Import:**

1. Wählen Sie die passende Import-Box (Fälle, Sequenzen oder Kontakte) und ziehen Sie entweder die entsprechende Datei in die Drop-Zone oder laden Sie die Daten über die entsprechende Schaltfläche (bspw. Falldaten hochladen) hoch.
2. Nutzen Sie nun die Auswahl-Tabellen, die erscheinen, um zu entscheiden, welche Einträge übernommen werden sollen.
3. Bestätigen Sie den Import. Bei Erfolg erscheint eine Bestätigung in der App.

> Tipp: Nutzen Sie den **Import-Assistenten**, wenn Sie schrittweise durch den Import geführt werden möchten.

---

### Falldaten

Format: CSV

Beispieldatei: <a href="/example_data/falldaten.csv" download>falldaten.csv</a>

Basisinformationen zu Fällen (z. B. ID, Registrierungsdatum, Ort, Ausbruchszuweisung). Erforderlich sind lediglich eine eindeutige ID und das Registrierungsdatum, wobei alle anderen Felder die Ausbruchsanalysen zusätzlich vereinfachen. Anhand von Adressangaben und Namen können zudem Kontakte dargestellt werden.

Die folgende Tabelle zeigt die verschiedenen Felder des Falldaten-Imports. Dabei sind auch alle möglichen Spaltenbenennungen eines Feldes angegeben. Diese können bei automatischen Exports abhängig von der verwendeten Quellsoftware voneinander abweichen.

| Feld                | Mögliche Spaltenbenennung                                                                                                                                                                       | Erforderlich |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| Fall ID             | `Fall ID`, `Aktenzeichen`                                                                                                                                                                       | ✅            |
| Registrierungsdatem | `Registrierungsdatum`, `Meldedatum`                                                                                                                                                             | ✅            |
| Sequenz ID          | `Sequenz ID`                                                                                                                                                                                    |              |
| Ausbruch            | `Ausbruch`, `AusbruchInfo_InternalName`, `AusbruchInfo_NameGA`, `AusbruchInfo_NameLS`, `AusbruchInfo_NameRKI`,`AusbruchInfo_GuidRecord`, `AusbruchInfo_Aktenzeichen`, `AusbruchInfo_InterneRef` |              |
| Angesteckt bei      | `Angesteckt bei`, `AngestecktBei`                                                                                                                                                               |              |
| Vorname             | `Vorname`, `PersonVorname`                                                                                                                                                                      |              |
| Nachname            | `Nachname`, `PersonFamilienname`                                                                                                                                                                |              |
| Ort                 | `Ort`, `PersonOrt`                                                                                                                                                                              |              |
| Postleitzahl        | `PLZ`, `PersonPLZ`                                                                                                                                                                              |              |
| Straße              | `Straße`, `PersonStrasse`                                                                                                                                                                       |              |
| Flexible Kategorie  | `Kategorie:{category_name}`                                                                                                                                                                     |              |

### Sequenzdaten 

Genomsequenzen werden auf Mutationen untersucht, wodurch die Basis für eine gentische Distanzberechnung zwischen Fällen geschaffen wird. Es ist erwähnenswert, dass nicht für jeden Fall eine Genomsequenz, da Gentrain auch wertvolle Rückschlüsse auf der Grundlage von Kontaktverfolgungsinformationen liefern kann. Es sind jedoch die genetischen Informationen, die Gentrain zu dem machen, was es ist!

#### Virales Fasta-Format

Format: FASTA

Beispieldatei: <a href="/example_data/sequenzdaten.fasta" download>sequenzdaten.fasta</a>

Für den Import von Genomsequenzen ist eine Fasta-Datei erforderlich, die die Sequenzen enthält, welche durch sogenannte Fasta-IDs identifiziert werden. Jede Fasta-Datei kann meherere Sequenzen enthalten, die so gleichzeitig importiert werden können. Der parallele Import mehrerer Dateien wird für Virus-Sequenzen nicht unterstützt.

```title="sequences.fasta"
    >{fasta_id_1}
    {sequence_1}
    >{fasta_id_2}
    {sequence_2}
    ...
    >{fasta_id_n}
    {sequence_n}
```

#### Bakterielles Fasta-Format

Format: FASTA oder ZIP mit FASTA-Dateien

Beispieldatei: <a href="/example_data/sequenzdaten.zip" download>sequenzdaten.zip</a>

Bakterielle Genome werden in Form von Assemblies bereitgestellt, da sie sowohl aus einer Genomsequenz als auch aus einer Plasmidsequenz bestehen. Darüber hinaus ist es keine triviale Aufgabe, kohärente bakterielle Sequenzen zusammenzusetzen (Assemblierung), was zu mehreren Contigs führt, die sich zur Gesamtsequenz verbinden. Jedes Contig ist durch einen individuellen Header gekennzeichnet, dessen Informationen für unseren Anwendungsfall nicht von Interesse sind. Bei bakteriellen Sequenzen wird die Fasta-ID durch den Namen der Fasta-Datei repräsentiert. Der parallele Import mehrerer Dateien wird für bakterielle Samples unterstützt, es kann außerdem ein Zip-Archiv mit mehreren Fasta-Dateien importiert werden.

```title="{fasta_id}.fasta"
    >{assembly_contig_header_1}
    {assembly_contig_sequence_1}
    >{assembly_contig_header_2}
    {assembly_contig_sequence_2}
    ...
    >{assembly_contig_header_n}
    {assembly_contig_sequence_n}
```

### Kontaktpersonendaten

Format: CSV

Beispieldatei: <a href="/example_data/kontaktdaten.csv" download>kontaktdaten.csv</a>

Angaben zu Kontaktpersonenvorgängen zwischen Fällen aus der Kontaktnachverfolgungs-Software.

| Field     | Naming options | Description                                                  | Erforderlich |
| --------- | -------------- | ------------------------------------------------------------ | ------------ |
| Fall-ID 1 | `Fall ID 1`    | Eindeutige ID des ersten Falls des Kontaktpersonen-Vorgangs  | ✅            |
| Fall-ID 2 | `Fall ID 2`    | Eindeutige ID des zweiten Falls des Kontaktpersonen-Vorgangs | ✅            |
| Typ       | `Typ`          | Typ des Kontaktpersonen-Vorgangs                             |              |
| Kontakt   | `Kontext`      | Kontaxt in dem es zum Kontaktpersonen-Vorgang gekommt ist    |              |

---


## Import-Assistent (Schritt-für-Schritt)

Der **Import-Assistent** unterstützt Sie beim Hochladen von Daten:

- Er zeigt, welche Dateien benötigt werden und in welcher Reihenfolge (zuerst Fälle, dann Sequenzen und Kontaktpersonendaten)
- Er erstellt eine Vorschau erkannter Datensätze und erklärt die Dateien
- Sie können per Checkbox auswählen, welche Datensätze importiert werden sollen

Der Assistent ist besonders hilfreich, wenn Unsicherheit beim Datenformat besteht.

---

## Datenübersicht

Die **Datenübersicht** zeigt alle importierten Einträge für das aktuell ausgewählte Pathogen:

- **Falldaten:** Liste aller Fälle mit Details; Einträge können durchsucht und gefiltert werden
- **Ausbrüche:** Liste der Ausbrüche mit Fallzahlen; Sie können Fälle Ausbrüchen zuordnen oder neue Ausbrüche erstellen
- **Gruppen:** Kategorisierte Gruppen (z. B. Impfstatus) mit zugehörigen Fallzahlen

---

## Datenlöschung & TTL (automatische Löschung)

GENTRAIN bietet Optionen zur Verwaltung der Lebensdauer lokaler Daten:

- **Standard-TTL:** Die lokale Datenbank hat standardmäßig eine Lebensdauer (z. B. 24 Stunden). Nach Ablauf wird sie automatisch gelöscht.
- **Flüchtige Speicherung (Delete on Exit):** Bei Aktivierung werden Daten nur für die aktuelle Sitzung gehalten und beim Neuladen oder Schließen des Browsers entfernt.
- **Manuelle Löschung:** Über **„Alle Daten löschen“** können Sie die lokale Datenbank sofort und unwiderruflich leeren.

> Hinweis: Wird die automatische Löschung ausgelöst, während die App nicht geöffnet ist, erfolgt die Löschung beim nächsten Start automatisch.

---

## Tipps zur Nutzung

- Reihenfolge beim Import: Zuerst Falldaten, dann Sequenzen, zuletzt Kontaktpersonendaten
- Prüfen Sie die Auswahl-Tabellen vor dem finalen Import: Datensätze können ein- oder abgewählt werden
- Verwenden Sie die Such- und Filterfunktionen in den Tabellen, um spezifische Datensätze schnell zu finden
- Orientieren Sie sich an den **exemplarischen Daten**, wenn Unsicherheit über das Datenformat besteht

---

## Fehlerbehebung

**Importfehler:**

- Prüfen Sie, ob die Datei das richtige Format hat. Fehler werden in der App angezeigt
- Bei fehlschlagendem Import versuchen Sie kleinere Dateien oder prüfen fehlende Pflichtfelder

## FAQ

**Wo liegen die Daten?**

- Die Daten werden lokal im Browser gespeichert (IndexedDB). Sie sind nur auf Ihrem Gerät und im Browser verfügbar, in dem sie importiert wurden. **Wir senden keine personenbezogenen Daten an externe Server.**

**Wie sicher ist GENTRAIN?**:

- GENTRAIN wurde von einem externen Dienstleister nach modernen Sicherheitsstandards geprüft. Dennoch sollten Sie beachten, dass die Anwendung lokal im Browser läuft und die Sicherheit Ihrer Daten auch von der Sicherheit Ihres Geräts und Browsers abhängt.

---
