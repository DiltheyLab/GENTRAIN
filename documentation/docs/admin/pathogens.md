---
title: Pathogene & Analyse-Schemata

sidebar_position: 3
---

Im Admin-Panel finden Sie unter dem Reiter **`Pathogen`** alle Funktionen zur Verwaltung von Pathogenen.
Hier können Sie Pathogene anlegen, ändern oder aktivieren sowie Analyse-Schema und Beispieldaten hochladen.

## Pathogene anlegen

1. Öffnen Sie im Reiter **`Pathogen`** die Übersicht und klicken Sie auf **`Create new`**.
2. Füllen Sie die Pflichtfelder **`Name`**, **`Type`** und **`Genetic Distance Threshold`** aus.
- Sie können zwischen den Pathogentypen **`Viral`** und **`Bacterial`** wählen. Davon abhängig werden unterschiedliche Analyse-Skripte ausgeführt, um Mutationen innerhalb von Genomsequenzen zu bestimmen.
- Der genetische Distanz-Schwellenwert (**`Genetic Distance Threshold`**) gibt an, ab welcher genetischen Distanz von einer direkten Infektion zwischen zwei Fällen ausgegangen werden kann.
3. Setzen Sie das Pathogen auf „aktiv” oder „inaktiv”. In der GENTRAIN-Anwendung stehen nur alle aktiven Pathogene zur Verfügung.
4. Laden Sie das entsprechende Analyse-Schema hoch. Die Struktur des Schema ist abhängig vom gewählten Pathogentyp, der Inhalt vom Pathogen. Weitere Informationen finden Sie unter <i>TODO: add link to pathogen scheme</i>.
5. Sie haben außerdem die Möglichkeit, Beispiel-Daten hochzuladen. Diese können anschließend über die GENTRAIN-Datenverwaltung für das jeweils aktive Pathogen heruntergeladen werden.
6. Bestätigen Sie ihre Angaben, indem Sie auf „Save” klicken.

## Pathogene bearbeiten

Abgesehen vom gewählten Pathogentyp können Sie Pathogene nachträglich ändern. Schemata können nicht gelöscht, sondern nur durch ein anderes ersetzt werden.

## Analyse-Schemata

Bei der Analyse von Genomsequenzen dienen Schemata als Referenz für die importierten Sequenzdaten. Da für Viren und Bakterien verschiedene Skripte zur Mutationsbestimmung verwendet werden, unterscheiden sich auch die Schemata in ihrer Struktur.

### Viren
| Datei / Element   | Zweck                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `pathogen.json`   | Metadaten über Pathogen, Clades/Lineages, Versionsinfo,<br/>Festlegung der verwendeten Referengenom-Datei (`reference.fasta`) |
| `reference.fasta` | Referenzgenom für Alignment und Mutation Calling                                                                          |
| `tree.json`       | Phylogenetischer Baum / Clade-Struktur                                                                                    |

### Bakterien
| Datei / Element     | Zweck                                             |
| ------------------- | ------------------------------------------------- |
| `.genes_list`       | Liste aller Loci im Schema                        |
| `.schema_config`    | Konfigurations- und Metadaten des Schemas         |
| `self_scores`       | Qualitäts- und Ähnlichkeitsbewertung der Allele   |
| `loci_modes`        | Definiert den Calling-Modus pro Locus             |
| `*.fasta`           | Alle Allele eines Locus im Hauptschema            |
| `short/*.fasta`     | Reduzierte/repräsentative Allele für Short-Schema |
| `short/self_scores` | Bewertungstabelle für das Short-Schema            |


