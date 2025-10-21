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

---

## Datenimport

Im **Importbereich** können Sie drei Datentypen hochladen:

- **Falldaten (CSV):** Basisinformationen zu Fällen (z. B. ID, Datum, Ort, Ausbruch-Zuweisung)
- **Sequenzdaten (FASTA):** Zu jedem Fall können Sie Sequenzdaten importieren
- **Kontaktpersonendaten (CSV):** Epidemiologische Informationen zwischen Fällen aus dem KoNa-Tool, beispielsweise **„angesteckt bei“**.

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

:::info SurvNet

Wenn Sie SurvNet verwenden, können Sie im Abschnitt [SurvNet-Import](./import-options/export) nachlesen wie Sie Fall- und Kontaktpersonendaten direkt aus dem Survnet exportieren und in GENTRAIN importieren können.
:::
