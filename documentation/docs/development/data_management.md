# Datenmanagement

Ausbruchsanalysen basieren auf _Minimum Spanning Tree (MST)_-Visualisierungen von Infektionsfällen, die durch genetische
Distanzen oder Kontaktverfolgungsereignisse verbunden sind. Diese MSTs sind auf einen importierten Datensatz angewiesen, der aus Fällen, sequenzierten
Proben und
Kontaktinformationen besteht.

## Datei-Importe

### Fälle

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

#### Fall-Persistenz und Kontaktextraktion

```mermaid
flowchart TB
    A@{ shape: lean-r, label: "Csv-Datei<br/><small>Fall-ID, Sequenz-ID, Ausbruch, Registriert am, PLZ, Ort, Straße, Vorname, Nachname, Angesteckt bei, Flexible Kategorien und Gruppen</small>" }-->B[CSV-Header validieren<br/><small>Erforderliche Spaltennamen</small>]--> PERSIST_CASES_AND_CONTACTS
    subgraph PERSIST_CASES_AND_CONTACTS["Fälle und Kontakte speichern"]
        direction LR
        Input_CREATE_CASES@{ shape: lean-r, label: "Csv-Zeilen"}-->D
        D[Fälle erstellen / aktualisieren]--> CREATE_CASE --> F
        subgraph CREATE_CASE["Fall erstellen / aktualisieren"]
            direction TB
            Input_CREATE_CASE@{ shape: lean-r, label: "Fall-ID, Sequenz-ID, Ausbruch, Registriert am, PLZ, Ort, Straße, Vorname, Nachname, Flexible Kategorien und Gruppen" }-->A0
            A0[Bereinigen und Falldatenobjekt erstellen] --> FIND_OR_CREATE_OUTBREAK
            subgraph FIND_OR_CREATE_OUTBREAK["Ausbruch suchen oder erstellen"]
                O0{Ausbruch vorhanden?} -->|Ja| O1@{ shape: lean-r, label: "Ausbruch-ID" }
                O0 -->|Nein| O2[Ausbruch in IndexedDB erstellen] --> O1
            end
            FIND_OR_CREATE_OUTBREAK-->FIND_OR_CREATE_CATEGORIES_AND_GROUPS
            subgraph FIND_OR_CREATE_CATEGORIES_AND_GROUPS["Kategorien und Gruppen suchen oder erstellen"]
                C0{Kategorie vorhanden?} -->|Ja| C1[Gruppe für Kategorie erstellen] --> C3
                C0 -->|Nein| C2[Kategorie in IndexedDB erstellen] --> C1
                C3@{ shape: lean-r, label: "Gruppen-ID" }
            end
            FIND_OR_CREATE_CATEGORIES_AND_GROUPS-->A1
            A1{Fall in IndexedDB vorhanden?}-->|Ja| A2["Bestehenden Fall in IndexedDB aktualisieren<br/><small>Fall-ID, Sequenz-ID, Ausbruch-ID, Registriert am, PLZ, Ort, Straße, Vorname, Nachname, Gruppen-IDs</small>"] --> Output_CREATE_CASE
            A1-->|Nein| A3["Neuen Fall in IndexedDB erstellen<br/><small>Fall-ID, Sequenz-ID, Ausbruch-ID, Registriert am, PLZ, Ort, Straße, Vorname, Nachname, Gruppen-IDs</small>"]--> Output_CREATE_CASE
            Output_CREATE_CASE@{ shape: lean-r, label: "Fall-ID" }
        end
        F[Bestehende Kontakte für hochgeladene Fälle löschen] --> CREATE_CONTACTS
        subgraph CREATE_CONTACTS["Kontakte für hochgeladene Fälle erstellen"]
            direction TB
            Input_CREATE_CONTACT@{ shape: lean-r, label: "Angesteckt bei, Straße, PLZ, Ort, Nachname" }-->B0
            B0[Kontakte vom Typ 'infected_by' erstellen] --> B1[Kontakte vom Typ 'same_address_and_last_name' erstellen] --> B2[Kontakte vom Typ 'same_address' erstellen]
        end
    end
```

### Samples (Sequenzen)

Samples stellen Verknüpfungen (Mappings) zwischen Fällen und dem entsprechenden sequenzierten Genom bereit. Es ist erwähnenswert, dass nicht jeder Fall sequenziert werden muss, da Gentrain auch wertvolle Rückschlüsse auf der Grundlage von Kontaktverfolgungsinformationen liefern kann. Es sind jedoch die genetischen Informationen, die Gentrain zu dem machen, was es ist!

Bei der Kommunikation mit dem Server werden Fasta-IDs mithilfe von UUIDv4-Werten pseudonymisiert (<a href="https://www.rfc-editor.org/rfc/rfc9562.html#name-example-of-a-uuidv4-value" target="_blank">RFC9562</a>).

#### Fasta-Dateiformat

##### Virales Fasta-Format

Für den Import von Samples ist eine Fasta-Datei erforderlich, die die Sequenzen enthält, welche durch sogenannte Fasta-IDs identifiziert werden. Jede Fasta-Datei enthält mehrere Sequenzen, die gleichzeitig importiert werden können. Der Upload mehrerer Dateien wird für Virus-Samples nicht unterstützt.

```title="sequences.fasta"
    >{fasta_id_1}
    {sequence_1}
    >{fasta_id_2}
    {sequence_2}
    ...
    >{fasta_id_n}
    {sequence_n}

```

##### Bakterielles Fasta-Format

Bakterielle Genome werden in Form von Assemblies bereitgestellt, da sie sowohl aus einer Genomsequenz als auch aus einer Plasmidsequenz bestehen. Darüber hinaus ist es keine triviale Aufgabe, kohärente bakterielle Sequenzen zusammenzusetzen (Assemblierung), was zu mehreren Contigs führt, die sich zur Gesamtsequenz verbinden. Jedes Contig ist durch einen individuellen Header gekennzeichnet, dessen Informationen für unseren Anwendungsfall nicht von Interesse sind. Bei bakteriellen Samples muss die Fasta-ID durch den Namen der Fasta-Datei repräsentiert werden. Der Upload mehrerer Dateien wird für bakterielle Samples unterstützt.

```title="{fasta_id}.fasta"
    >{assembly_contig_header_1}
    {assembly_contig_sequence_1}
    >{assembly_contig_header_2}
    {assembly_contig_sequence_2}
    ...
    >{assembly_contig_header_n}
    {assembly_contig_sequence_n}

```

#### Sequenzverarbeitung

Zwischen allen Samples werden genetische Distanzen berechnet, die anschließend in einer Distanzmatrix zusammengefasst werden. Diese Distanzmatrix ermöglicht es, einen Minimum Spanning Tree für die Fälle auf Basis der genetischen Distanz zu erstellen. Das Verfahren ist bei viralen und bakteriellen Samples leicht unterschiedlich.

```mermaid
graph LR
A@{ shape: lean-r, label: "Fasta file(s)"}-->B[<a href="../genomic_operations#sequence-analysis" target="_blank">Sequence analysis</a>]-->X@{ shape: lean-r, label: "Sequence Analysis Results"}
X -->C[<a href="../genomic_operations#distance-calculation" target="_blank">Distance calculation</a>]
C -->D[<a href="../genomic_operations#distance-matrix-assembling" target="_blank">Distance matrix assembling</a>]-->E@{ shape: lean-r, label: "Distance matrix"}
E --> F[Minimum spanning tree generation]-->G@{ shape: lean-r, label: "Minimum spanning tree"}-->H[<a href="https://gentrain.bi.denbi.de" target="_blank">Dashboard</a>]
G --> I[<a href="https://gentrain.bi.denbi.de/outbreak-analysis" target="_blank">Outbreak Analysis</a>]
E --> H
X --> Y[<a href="https://gentrain.bi.denbi.de/data-management" target="_blank">Data Management</a>]
```

### Kontaktpersonen-Vorgänge

Kontaktpersonen-Vorgänge liefern Informationen darüber, welche Fälle miteinander in Kontakt standen. Diese Informationen erweitern die Kontaktinformationen, die wir aus Adressen und Namen extrahieren. Der Import von Kontaktpersonen führt zu Kontaktkanten, die als 'Contact person' bezeichnet werden.

| Field     | Naming options | Description                                                 | Required |
| --------- | -------------- | ----------------------------------------------------------- | -------- |
| Fall-ID 1 | `Fall ID 1`    | Eindeutige ID des ersten Falls des Kontaktpersonen-Vorgangs | ✅       |
| Fall-ID 2 | `Fall ID 2`    | Unique ID of the second case of the contact person process  | ✅       |

```mermaid
flowchart LR
    A@{ shape: lean-r, label: "Csv file<br/><small>Case id 1, Case id 2</small>" }
    A --> B[Validate csv header] --> C[Filter already existing contacts] --> D[Create a contact of type <i>contact_person</i> for each pair of case ids]
```

## Data Processing

```mermaid
graph TB
User@{ shape: circle, label: "User" }-->Input_Cases
User@{ shape: circle, label: "User" }-->Input_Samples
User@{ shape: circle, label: "User" }-->Input_Contacts
Input_Cases@{ shape: lean-r, label: "Cases Csv File"}-->Data_Management--Cases-->Validation
Input_Samples@{ shape: lean-r, label: "Sequences Fasta File(s)"}-->Data_Management--Sequences-->Validation
Input_Contacts@{ shape: lean-r, label: "Contact Persons Csv File"}-->Data_Management--Contacts-->Validation
Input_JSON@{ shape: lean-r, label: "IndexedDB JSON File"}-->State_Import@{ shape: lin-rect, label: "IndexedDB Import" }-->IndexedDB
API--"*HTTPS*<br/>Pathogens"-->IndexedDB
Validation@{ shape: lin-rect, label: "Validation" }--"Fasta Content<br/>(Sequences / Assemblies)"-->Pseudonymization--"Pseudonymized Fasta Content"-->Fasta_Chunking@{ shape: lin-rect, label: "Fasta Chunking" }
Validation--Contacts-->IndexedDB
Validation--Cases-->IndexedDB
Fasta_Chunking--Pseudonymized Fasta Chunks-->Websocket_Client[Websocket Client]--"*WSS*<br/>Pseudonymized Fasta Chunks"-->Chunk_Validation
subgraph Server
    Chunk_Validation
    Redis--Chunks-->Fasta_Content_Reassembling
    Chunk_Validation@{ shape: lin-rect, label: "Chunk Validation" }-->Fasta_Content_Reassembling@{ shape: lin-rect, label: "Fasta Content Reassembling" }-->Sequence_Analysis@{ shape: lin-rect, label: "Sequence Analysis" }--Results-->Redis[(Redis Cache)]
    Chunk_Validation--Chunk-->Redis
    File_Storage--"Pathogen Schemes"-->Sequence_Analysis
    Flask_Admin--"Pathogen Schemes"-->File_Storage@{ shape: win-pane, label: "File Storage" }
    Flask_Admin[Flask Admin]--Pathogens,Users-->PostgreSQL
    PostgreSQL[(PostgreSQL)]--Pathogens-->API[Flask API]
end
Sequence_Analysis--"*WSS*<br/>Analysis Results"-->Websocket_Client[Websocket Client]-->Distance_Calculation@{ shape: lin-rect, label: "Distance Calculation" }--"Distances"-->IndexedDB
IndexedDB[(IndexedDB)]--Cases,Distances,Contacts-->Dashboard(Dashboard)
Websocket_Client[Websocket Client]--"Sequence Analysis Results"-->IndexedDB
IndexedDB-->State_Export@{ shape: lin-rect, label: "IndexedDB Export" }-->Output_JSON@{ shape: lean-r, label: "IndexedDB JSON File"}
Dashboard-->DM_Export@{ shape: lin-rect, label: "Distance Matrix Export" }-->Distance_Matrix_Csv@{ shape: lean-r, label: "Distance Matrix Csv File"}
Outbreak_Analysis--"Outbreak Analysis State"-->
IndexedDB[(IndexedDB)]--"Cases,Distances,Contacts,Outbreak Analysis State"-->Outbreak_Analysis(Outbreak Analysis)
IndexedDB[(IndexedDB)]-->Data_Management(Data Management)-->Data_Deletion@{ shape: lin-rect, label: "Data Deletion<br/><i>All or pathogen-specific Data</i>" }-->IndexedDB
Outbreak_Analysis-->Pdf_Export@{ shape: lin-rect, label: "Pdf Export" }-->Pdf_Report@{ shape: lean-r, label: "Analysis Report Pdf File"}
```

## Entity Relationship Models

### Client Side (IndexedDB)

```mermaid
erDiagram
    Analysis {
        int id
        string name
        object settings
        datetime created_at
        datetime updated_at
    }
    Analysis }o--|| Pathogen : ""

    Case {
        int id
        string ref_id
        string fasta_id
        datatime registered_at
        string city
        string zip_code
        string street
        string last_name
        string first_name
        datetime created_at
        datetime updated_at
    }
    Case }o--|| Pathogen : ""
    Case }o--o{ Group : ""
    Case }o--|| Outbreak : ""
    Case ||--o{ "Sequence Analysis Cases" : ""

    Category {
        int id
        string name
        datetime created_at
        datetime updated_at
    }
    Category }o--|| Pathogen : ""

    Contact {
        int id
        int case_id_1
        int case_id_2
        string type
        string context
        datetime created_at
        datetime updated_at
    }
    Contact }o--o| Case : ""

    "Distance Matrix" {
        int id
        datetime created_at
        datetime updated_at
    }
    "Distance Matrix" ||--|| Pathogen : ""

    Distance {
        int id
        int case_id_1
        int case_id_2
        int value
        datetime created_at
        datetime updated_at
    }
    Distance }o--|| "Distance Matrix" : ""
    Distance ||--|{ Case : ""

    Group {
        int id
        string name
        datetime created_at
        datetime updated_at
    }
    Group }o--|| Category : ""

    Outbreak {
        int id
        string name
        datetime created_at
        datetime updated_at
    }
    Outbreak }o--|| Pathogen : ""

    "Pathogen Type" {
        int id
        string name
        datetime initialized_at
        datetime created_at
        datetime updated_at
    }

    Pathogen {
        int id
        string name
        int genetic_distance_threshold
        int pathogen_type_id
        datetime created_at
        datetime updated_at
    }
    Pathogen }o--|| "Pathogen Type" : ""

    "Sequence Analysis Cases" {
        string sequence_analysis_id
        string fasta_id
        datetime created_at
        datetime updated_at
    }

    "Sequence Analysis" {
        int id
        string hash
        object result
        string schema
        string version
        datetime created_at
        datetime updated_at
    }
    "Sequence Analysis" ||--|{ "Sequence Analysis Cases" : ""
```

### Server Side (ProstgreSQL)

```mermaid
erDiagram
    Pathogen {
        int id
        string name
        int genetic_distance_threshold
        string type
        string scheme_name
        datetime created_at
        datetime updated_at
    }

    Role {
        int id
        string name
        string description
    }

    User {
        int id
        string username
        string password
        boolean active
        datetime confirmed
        string fs_uniquifier
        datetime created_at
        datetime updated_at
    }
    User ||--o{ Role : ""
```
