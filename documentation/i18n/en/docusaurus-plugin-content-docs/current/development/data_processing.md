---
id: data-processing
title: Data Processing
sidebar_label: Data Processing
sidebar_position: 4
---

# Data processing

Outbreak analyses are based on _minimum spanning trees (MST)_ visualizations of infection cases linked by genetic distances or contact tracing events.
These MSTs rely on an imported dataset consisting of cases, sequenced samples, and contact information.
The MST visualizations are generated using a network graph, which represents the relationships between cases and samples. The graph is constructed by connecting cases and samples based on their genetic distances or contact tracing events.

## File imports

### Case data

Cases are registered infection reports from health authorities.
These are recorded using the <a href="https://www.rki.de/DE/Content/Infekt/IfSG/Software/software_inhalt.html" target="_blank">SurvNet software</a> developed by the RKI. Personal data is handled and stored exclusively on the client side. Addresses and names are used to create contact edges between cases, as it is valuable information if cases live at the same address (shared apartments, retirement homes, etc.) or have the same last name (potential family members).

A CSV structure with relevant fields was created for importing case data from SurvNet:

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

#### Processing cases

![Fallverarbeitung](/img/en/developers/data_processing/case_processing.jpg "Fallverarbeitung")


### Sequence data

Genetic distances are calculated between all imported sequences. To do this, a compressed representation of the sequences is first generated based on the available mutations. In the case of viruses, GENTRAIN uses [Nextclade](https://docs.nextstrain.org/projects/nextclade/en/stable/user/nextclade-cli/reference.html), while [chewBBACA](https://chewbbaca.readthedocs.io/en/latest/user/modules/AlleleCall.html) is used to determine the alleles present.
Based on the mutations, genetic distances between genome sequences can then be calculated and summarized in a distance matrix. This distance matrix makes it possible to create a minimum spanning tree for the cases based on the genetic distance.

![Sequence aggregation](/img/en/developers/data_processing/sequence_aggregation.jpg "Sequence aggregation")

![Sequence processing](/img/en/developers/data_processing/sequence_processing.jpg "Sequence processing")


### Contact person data

Contact person events provide information about which cases were in contact with each other. This information supplements the contact information we extract from addresses and names. Importing contact persons results in contact edges labeled as ‘Contact person’.

| Field     | Naming options | Description                                                 | Required |
| --------- | -------------- | ----------------------------------------------------------- | -------- |
| Case ID 1 | `Fall ID 1`    | Unique ID of the first case of the contact person process| ✅       |
| Case ID 2 | `Fall ID 2`    | Unique ID of the second case of the contact person process  | ✅       |

![Contact processing](/img/en/developers/data_processing/contact_processing.jpg "Contact processing")
