---
id: data-processing
title: Datenverarbeitung
sidebar_label: Datenverarbeitung
sidebar_position: 4
---

# Datenverarbeitung

Ausbruchsanalysen basieren auf _Minimum Spanning Tree (MST)_-Visualisierungen von Infektionsfällen, die durch genetische
Distanzen oder Kontaktverfolgungsereignisse verbunden sind. Diese MSTs sind auf einen importierten Datensatz angewiesen, der aus Fällen, sequenzierten
Proben und
Kontaktinformationen besteht.

## Datei-Importe

### Falldaten

Fälle sind registrierte Infektionsmeldungen von den Gesundheitsbehörden.
Diese werden mit der vom RKI entwickelten <a href="https://www.rki.de/DE/Content/Infekt/IfSG/Software/software_inhalt.html" target="_
blank">SurvNet-Software</a> erfasst. Personenbezogene Daten werden ausschließlich clientseitig gehandhabt und gespeichert. Adressen und Namen werden verwendet, um Kontaktkanten zwischen Fällen zu erstellen, da es eine wertvolle Information ist, wenn Fälle an derselben Adresse leben (Wohngemeinschaften, Seniorenheime, ...) oder denselben Nachnamen haben (potenzielle Familienmitglieder).

Für den Import von Falldaten aus SurvNet wurde eine CSV-Struktur mit relevanten
Feldern erstellt:

| Field             | Naming options                                                                                                                                                                                  | Description                                                       | Required |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------- |
| Case id           | `Fall ID`, `Aktenzeichen`                                                                                                                                                                       | Unique ID of the case                                             | ✅       |
| Registration date | `Registrierungsdatum`, `Meldedatum`                                                                                                                                                             | Date of registration in SurvNets                                  | ✅       |
| Sequence id       | `Sequenz ID`                                                                                                                                                                                    | Fasta ID of the corresponding sequence                            |          |
| Outbreak          | `Ausbruch`, `AusbruchInfo_InternalName`, `AusbruchInfo_NameGA`, `AusbruchInfo_NameLS`, `AusbruchInfo_NameRKI`,`AusbruchInfo_GuidRecord`, `AusbruchInfo_Aktenzeichen`, `AusbruchInfo_InterneRef` | Suspected outbreak association                                    |          |
| Infected by       | `Angesteckt bei`, `AngestecktBei`                                                                                                                                                               | Unique ID of a case that was given as the origin of the infection |          |
| Firstname         | `Vorname`, `PersonVorname`                                                                                                                                                                      | First name of the person associated with the case                 |          |
| Lastname          | `Nachname`, `PersonFamilienname`                                                                                                                                                                | Last name of the person associated with the case                  |          |
| City              | `Ort`, `PersonOrt`                                                                                                                                                                              | Place of residence of the person associated with the case         |          |
| Zip code          | `PLZ`, `PersonPLZ`                                                                                                                                                                              | Zip code of the person associated with the case                   |          |
| Street            | `Straße`, `PersonStrasse`                                                                                                                                                                       | Street of the person associated with the case                     |          |
| Flexible category | `Kategorie:{category_name}`                                                                                                                                                                     | Flexible category for further differentiation                     |          |

#### Verarbeitung von Fällen

![Fallverarbeitung](/img/developers/data_processing/case_processing.jpg "Fallverarbeitung")


### Sequenzdaten

Zwischen allen importierten Sequenzen werden genetische Distanzen berechnet. Hierzu wird zunächst eine komprimierte Repräsentation der Sequenzen auf Basis der vorliegenden Mutationen erzeugt. Im Falle von Viren verwendet GENTRAIN [Nextclade](https://docs.nextstrain.org/projects/nextclade/en/stable/user/nextclade-cli/reference.html), während [chewBBACA](https://chewbbaca.readthedocs.io/en/latest/user/modules/AlleleCall.html) für die Bestimmung vorliegender Allele eingesetzt wird.
Auf Basis der Mutationen können anschließend genetische Distanzen zwischen Genomsequenzen berechnet werden, die anschließend in einer Distanzmatrix zusammengefasst werden. Diese Distanzmatrix ermöglicht es, einen Minimum Spanning Tree für die Fälle auf Basis der genetischen Distanz zu erstellen.

![Sequenzaggregation](/img/developers/data_processing/sequence_aggregation.jpg "Sequenzaggregation")

![Sequenzverarbeitung](/img/developers/data_processing/sequence_processing.jpg "Sequenzverarbeitung")


### Kontaktpersonendaten

Kontaktpersonen-Vorgänge liefern Informationen darüber, welche Fälle miteinander in Kontakt standen. Diese Informationen erweitern die Kontaktinformationen, die wir aus Adressen und Namen extrahieren. Der Import von Kontaktpersonen führt zu Kontaktkanten, die als 'Contact person' bezeichnet werden.

| Field     | Naming options | Description                                                 | Required |
| --------- | -------------- | ----------------------------------------------------------- | -------- |
| Fall-ID 1 | `Fall ID 1`    | Eindeutige ID des ersten Falls des Kontaktpersonen-Vorgangs | ✅       |
| Fall-ID 2 | `Fall ID 2`    | Eindeutige ID des zweiten Falls des Kontaktpersonen-Vorgangs  | ✅       |

![Kontaktverarbeitung](/img/developers/data_processing/contact_processing.jpg "Kontaktverarbeitung")
