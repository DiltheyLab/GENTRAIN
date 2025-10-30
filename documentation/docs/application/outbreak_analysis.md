---
id: outbreakAnalysis
title: Ausbruchsanalyse
sidebar_label: Ausbruchsanalyse
sidebar_position: 3
---

# Ausbruchsanalyse

Die **Ausbruchsanalyse** ist das interaktive Werkzeug in **GENTRAIN**, mit dem Sie Ausbrüche feingranular untersuchen und Infektionsketten nachvollziehen können. Diese Seite erläutert die wichtigsten Bereiche und zeigt, wie Sie typische Aufgaben Schritt für Schritt durchführen.

---

## Überblick

Die Ausbruchsanalyse besteht aus zwei Hauptbereichen:

- **Linke Seitenleiste:** Einstellungen und Filter für die Analyse (Ausbruchsauswahl, Umgebungsauswahl, Fallfilter, Kontaktnachverfolgung, Einfärbung, Exportfunktionen)
- **Hauptbereich:** Interaktive Visualisierung (Minimaler Spannbaum), Detailansichten zu Fällen, Legende und Graph-Werkzeuge

Kurz gesagt:  
Links wählen Sie aus, **was** angezeigt wird – rechts sehen Sie **das Ergebnis** als interaktiven Graphen.

---

## Schritt-für-Schritt-Anleitung: Eine Analyse starten

### 1. Ausbruch auswählen

- Öffnen Sie die **Ausbruchsauswahl** in der linken Seitenleiste (Schritt 1).
- Wählen Sie den Ausbruch, den Sie analysieren möchten.  
  Falls noch kein Ausbruch angelegt wurde, können Sie entweder im Dashboard mit Hilfe des Clusterings einen Ausbruch erzeugen oder auf der Seite **Datenverwaltung** einen neuen Ausbruch erstellen und Fälle zuordnen.

### 2. Umgebungs auswählen

- Im Abschnitt **„Umgebung auswählen“** (Schritt 2) legen Sie fest, welche zusätzlichen Falldaten (z. B. andere Ausbrüche oder Gruppen) in die Visualisierung aufgenommen werden sollen.
- Optionen:
  - **Keine Falldaten:** Nur Fälle des ausgewählten Ausbruchs
  - **Alle Falldaten:** Einschluss aller importierten Fälle
  - **Falldaten auswählen:** Nur bestimmte Gruppen oder andere Ausbrüche

### 3. Fälle filtern

- Im Bereich **„Fälle filtern“** (Schritt 3) können Sie:
  - Nicht sequenzierte Fälle ausschließen
  - Fälle nach genetischer Distanz (Threshold) herausfiltern
  - Einen Datumsbereich festlegen und Fälle die außerhalb des Bereichs liegen herausfiltern
- Diese Filter beeinflussen, welche Knoten (Fälle) in der Visualisierung erscheinen. Die Fälle des ausgewählten Ausbruchs bleiben immer sichtbar und sind nicht von dem Filter betroffen.

### 4. Kontaktnachverfolgung anzeigen

- Aktivieren Sie **„Kontaktkanten anzeigen“**, um epidemiologische Informationen zwischen Fällen sichtbar zu machen.
- Diese Ansicht hilft Ihnen, **mögliche Übertragungswege** zu identifizieren.

### 5. Einfärbung und Darstellung

- Im Abschnitt **Einfärbung** bestimmen Sie, wie die Knoten eingefärbt werden:
  - Nach **Zeitspanne** (zeitliche Einfärbung nach Registrierungsdatum)
  - Nach **Ausbrüchen** (Ausbruch-Färbung)
- Bei der Option „Nach Ausbrüchen“ können Sie wählen, ob der aktuell analysierte Ausbruch oder umliegende Ausbrüche hervorgehoben werden sollen. Sie können über ein Klick auf die farbige Schaltfläche die Einfärbung ändern.

### 6. Visualisierung nutzen

- Klicken Sie auf einen Knoten in dem Graphen, um **Fall-Details** anzuzeigen. Sollten genetische Distanzen zu anderen Knoten vorliegen, welche unterhalb des Distanz-Schwellenwertes liegen, werden diese ebenfalls als rote gestrichelte Linien angezeigt. Das ermöglicht es, potenzielle Verbindungen zwischen Fällen zu erkennen, die durch die Darstellung als Minimaler Spannbaum sonst verborgen geblieben wären.
- Verwenden Sie die **Zoom-** und **Pan-Funktionen**, um bestimmte Bereiche zu fokussieren.
- In der **Legende** sehen Sie, welche Farben und Symbole aktuell verwendet werden.

### 7. PDF-Export

- Klicken Sie auf **„Ausbruchsanalyse-Report exportieren“**, um einen Bericht der aktuellen Analyse zu erstellen. Dieser enthält eine Zusammenfassung des Ausbruchsszenarios, eine **automatisch generierte Bewertung** und eine Abbildung der Visualisierung mit indizierten Fällen.
- Sie können den Bericht bei der Erstellung individuell anpassen.
- Wenn die Erstellung abgeschlossen ist, wird der Bericht als PDF-Datei heruntergeladen.

### 7. Speichern und Beenden

- Wenn Sie die Analyse abgeschlossen haben, klicken Sie auf **„Analyse speichern und beenden“** (unten in der Seitenleiste), um Ihre Arbeit zu sichern und zur Übersicht zurückzukehren.

---

## Zusätzliche Funktionen

- **Auto-Save:** Die Analyse wird automatisch zwischengespeichert.

---

## Tipps und Fehlerbehebung

**Keine Ausbrüche sichtbar:**

- Prüfen Sie in der Übersicht, ob Ausbrüche existieren oder ob Filter zu restriktiv eingestellt sind. Der Graph kann nur

---

## Häufige Fragen (FAQ)

**Was ist der Unterschied zwischen „Ausbruch“ und „Umgebung“?**

- „Ausbruch“ bezeichnet die Fälle, die einem vordefiniertem Ausbruch zugeordnet wurden. Dies kann entweder direkt im Import, über die Datenverwaltung oder durch Clustering im Dashboard geschehen sein.
- „Umgebung“ umfasst zusätzliche Fälle (z. B. andere Ausbrüche oder Gruppen), die als Kontext mit angezeigt werden können.

**Wie kann ich meine Ansicht sichern?**

- Verwenden Sie **„Analyse speichern und beenden“** oder aktivieren Sie **Auto-Save**.  
  Zusätzlich können Sie den Zustand lokal exportieren (Zustand speichern).

---
