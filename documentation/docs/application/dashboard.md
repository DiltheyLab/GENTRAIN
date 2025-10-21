---
id: dashboard
title: Dashboard
sidebar_label: Dashboard
sidebar_position: 2
---

# Dashboard

Das **Dashboard** ist die zentrale Ansicht Ihres gesamten Datenbestands in **GENTRAIN**.  
Es bietet interaktive **Auswertungs- und Visualisierungsmöglichkeiten** für alle Daten. Darüber hinaus finden Sie dort Werkzeuge zur Anpassung der Visualisierung, einen interaktiven Graphen (Minimaler Spannbaum) zur Untersuchung von Kontakten und Ausbrüchen sowie Tabellen mit Detailinformationen.

> 🌐 **Produktive Umgebung:** [https://gentrain.bi.denbi.de](https://gentrain.bi.denbi.de)

---

## Seitenaufbau

Die Dashboard-Seite ist in drei Hauptbereiche unterteilt:

- **Linke Spalte (Einstellungen & Charts):**

  - Visualisierungsoptionen (z. B. Kontaktkanten oder nicht-sequenzierte Falldaten)
  - Optionen zur Einfärbung des Graphen (z. B. nach Ausbruch, Cluster oder Zeitspanne)
  - Übersichtscharts (z. B. Fälle pro Tag, Fälle pro Ausbruch/Cluster)

- **Rechte Spalte (Visualisierung):**

  - Interaktiver 2D-Graph mit Fällen (Knoten) und Verbindungen (Links)
  - Legende, Detail-Panel für ausgewählte Fälle und Grapheinstellungen

- **Unter dem Graphen:**
  - Informationstabellen mit Fall- und Clusterdetails
  - Distanzmatrix aller genetischen Distanzen

---

## Einstellungen

Im Bereich **„Einstellungen“** können Sie die Basisfilter konfigurieren:

- **Fälle ohne Sequenzen anzeigen:** Blendet Fälle ohne Sequenzdaten ein oder aus.
- **Kontaktkanten anzeigen:** Blendet die Kontaktkanten im Graphen ein oder aus. Diese enthalten Informationen aus Kontaktnachverfolgungsdaten oder gemeinsamen epidemiologischen Merkmalen.

Änderungen an den Einstellungen aktualisieren den Graphen sofort.  
Wird ein aktiver **Pathogenwechsel** erkannt, wird der Graph zunächst geleert und anschließend neu aufgebaut, damit die Visualisierung konsistent bleibt.

---

## Einfärbung

Die Einfärbung bestimmt, wie Knoten im Graphen farblich dargestellt werden.  
Mögliche Modi sind:

- **Ausbrüche:** Färbung nach bereits definierten Ausbrüchen
- **Zeitspanne:** Färbung nach Registrierungsdatum
- **Cluster:** Färbung nach automatisch identifizierten Clustern auf Basis genetischer Distanzen

Parameter:

- **Clusterschwellenwert:** Legt fest, ab welcher Distanz Fälle zu einem Cluster zusammengefasst werden.

:::info 🧬 Erklärung: Cluster

Im Modus **Cluster** werden zunächst alle Verbindungen betrachtet, deren genetische Distanz kleiner oder gleich dem eingestellten _Clusterschwellenwert_ ist.  
Kontaktkanten werden bei dieser distanzbasierten Analyse **nicht** als Distanzquelle verwendet.

Anschließend werden aus diesem Graphen **zusammenhängende Komponenten (connected components)** ermittelt:

- Komponenten kleiner als die minimale Clustergröße (Standard: **2 Fälle**) werden ausgefiltert.
- Verbliebene Komponenten erhalten fortlaufende **Cluster-Namen** (z. B. _Cluster 1_) und werden mithilfe einer erzeugten **ColorMap** farblich hervorgehoben.
- Fälle ohne verfügbare Sequenzdaten werden **nicht berücksichtigt**, da sie sonst tendenziell eigene (kleine) Gruppen bilden würden.  
  Diese Fälle erhalten stattdessen die Kennzeichnung _„kein Cluster zugewiesen“_.

:::

---

## Graph-Visualisierung

Der Graph stellt in seiner einfachsten Form Fälle als **Knoten** und genetische Verbindungen als **graue Kanten** in einem „Minimalen Spannbaum“ dar. Durchgezogene Kanten repräsentieren genetische Verbindungen **unterhalb** des pathogenabhängigen Distanzschwellenwerts, während gestrichelte Kanten genetische Verbindungen **gleich oder oberhalb** des Schwellenwerts darstellen. Das erlaubt eine schnelle visuelle Einschätzung der genetischen Nähe zwischen Fällen.

:::info Rote Zusatzkanten für genetische Distanzen

Beim Anklicken eines Falls können **zusätzliche rote, gestrichelte Kanten** eingeblendet werden.  
Diese Kanten erscheinen, wenn zwischen dem ausgewählten Fall und anderen Fällen eine **genetische Distanz** besteht, die **unterhalb des festgelegten Distanzschwellenwerts** liegt.

Damit lassen sich **potenzielle epidemiologische Verbindungen** sichtbar machen, die in der Darstellung als **Minimaler Spannbaum (Minimum Spanning Tree)** sonst verborgen bleiben würden – da in dieser Visualisierungsform jeder Fall nur durch eine einzige Kante verbunden ist.
:::

### Steuerung

#### Maus

- 🖱️ **Scrollrad:** Zoom in/aus
- 🖱️ **Linksklick + Ziehen:** Graph verschieben

#### Touchpad

- ✋ **Zwei-Finger-Zoom:** Zoom in/aus
- ✋ **Ein-Finger-Ziehen:** Graph verschieben

Verwenden Sie die Funktion `Zoom-to-Fit` in der unteren rechten Ecke, um den Graphen optimal an die Fenstergröße anzupassen.

Der Graph wird aus mehreren Quellen erstellt:  
**Distanzmatrix (genetische Distanzen)** und **Kontaktdaten**.

---

## Charts

Das Dashboard enthält zwei kompakte Diagramme zur schnellen Übersicht:

- **Fälle pro Tag (AreaChart):**  
  Aggregiert die Anzahl der Fälle pro Registrierungsdatum und trennt diese pro Cluster.  
  Nützlich, um **zeitliche Trends innerhalb von Clustern** zu erkennen.

- **Fälle pro Ausbruch/Cluster (PieChart):**  
  Zeigt die **Verteilung der Fälle auf die identifizierten Cluster**.  
  Das Zentrum des Diagramms zeigt die **Gesamtfallzahl** an.

**Beide Diagramme sind reaktiv**:

- Sie basieren auf dem aktuellen Graph-Datensatz und aktualisieren sich bei Änderungen der Einstellungen oder des aktiven Pathogens.

- Der Chart „Fälle pro Ausbruch/Cluster“ wird nur angezeigt, wenn ausreichend Platz verfügbar ist (z. B. auf größeren Bildschirmen).

---

## Tabellen und Detailinformationen

Unterhalb der Visualisierung finden Sie ausklappbare Informationsbereiche:

- **Fallinformationen:** Liste der in der aktuellen Ansicht enthaltenen Fälle mit wichtigen Feldern (z. B. Fall-ID, Registrierungsdatum, zugeordneter Ausbruch).
- **Informationen über gefundene Cluster:** Tabellarische Aufbereitung mit Cluster-Statistiken und relevanten Metadaten.
- **Genetische Distanzmatrix:** Detaillierte Matrix mit paarweisen genetischen Distanzen, die für Clustering und Abstandsberechnungen verwendet wird. Diese kann auch als CSV-Datei exportiert werden.

**Die Anzeige wechselt automatisch zwischen Cluster- und Falltabellen, je nachdem, welcher Einfärbungs-Modus aktiv ist.**

---

## Hinweise zur Datenaktualisierung

- Wenn sich das aktive Pathogen ändert, wird das Dashboard **neu initialisiert**, und die Graphdaten werden aus den aktuellen Fällen, Kontakten und der Distanzmatrix neu berechnet.

---

## Tipps und Fehlerbehebung

- 🔍 **Keine Daten sichtbar?**  
  Prüfen Sie, ob Sie das korrekte Pathogen ausgewählt haben oder ob Filter (z. B. „Fälle ohne Sequenzen anzeigen“) alle Fälle ausschließen.

---

## Weiterführende Informationen

Für Details zur Erzeugung der Distanzmatrix und zu den genomischen Operationen siehe den Abschnitt für Entwickler:  
`Entwicklung → Genomische Operationen`.
