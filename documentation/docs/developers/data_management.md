# Data Management

Outbreak analysis are based on _Minimum Spanning Tree (MST)_ visualizations of infection cases, which are connected by
genetic
distances or contact tracing events. These MSTs are reliant on an imported dataset consisting of cases, sequenced
samples and
contact information.

## File Imports

### Cases

Cases are registered infection reports from the health authorities.
These are recorded using the <a href="https://www.rki.de/DE/Content/Infekt/IfSG/Software/software_inhalt.html" target="_
blank">SurvNet software</a> developed by the RKI. Personal data is exclusively handled and persisted on the client side. Addresses and names are used to create contact edges between cases, as it is valuable information if cases live at the same address (flat shares, retirement homes, ...) or have the same lastname (potential family members).

To import case data from the SurvNet a csv structure with relevant
fields was constructed:

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

#### Case Persistence and Contact Extraction

```mermaid
flowchart TB
    A@{ shape: lean-r, label: "Csv file<br/><small>Case id, Sequence id, Outbreak, Registered at, Zip code, City, Street, Firstname, Lastname, Infected by, Flexible categories and groups</small>" }-->B[Validate csv header<br/><small>Required column names</small>]--> PERSIST_CASES_AND_CONTACTS
    subgraph PERSIST_CASES_AND_CONTACTS["Persist cases and contacts"]
        direction LR
        Input_CREATE_CASES@{ shape: lean-r, label: "Csv rows"}-->D
        D[Create / update cases]--> CREATE_CASE --> F
        subgraph CREATE_CASE["Create / update case"]
            direction TB
            Input_CREATE_CASE@{ shape: lean-r, label: "Case id, Sequence id, Outbreak, Registered at, Zip code, City, Street, Firstname, Lastname, Flexible categories and groups" }-->A0
            A0[Sanitize and create case data object] --> FIND_OR_CREATE_OUTBREAK
            subgraph FIND_OR_CREATE_OUTBREAK["Find or create outbreak"]
                O0{Outbreak exists?} -->|Yes| O1@{ shape: lean-r, label: "Outbreak id" }
                O0 -->|No| O2[Create outbreak in IndexedDB] --> O1
            end
            FIND_OR_CREATE_OUTBREAK-->FIND_OR_CREATE_CATEGORIES_AND_GROUPS
            subgraph FIND_OR_CREATE_CATEGORIES_AND_GROUPS["Find or create categories and groups"]
                C0{Category exists?} -->|Yes| C1[Create group for category] --> C3
                C0 -->|No| C2[Create category in IndexedDB] --> C1
                C3@{ shape: lean-r, label: "Group id" }
            end
            FIND_OR_CREATE_CATEGORIES_AND_GROUPS-->A1
            A1{Case exists in IndexedDB?}-->|Yes| A2["Update existing case in IndexedDB<br/><small>Case id, Sequence id, Outbreak id, Registered at, Zip code, City, Street, Firstname, Lastname, Group ids</small>"] --> Output_CREATE_CASE
            A1-->|No| A3["Create new case in IndexedDB<br/><small>Case id, Sequence id, Outbreak id, Registered at, Zip code, City, Street, Firstname, Lastname, Group ids</small>"]--> Output_CREATE_CASE
            Output_CREATE_CASE@{ shape: lean-r, label: "Case id" }
        end
        F[Delete existing contacts for uploaded cases] --> CREATE_CONTACTS
        subgraph CREATE_CONTACTS["Create contacts for uploaded cases"]
            direction TB
            Input_CREATE_CONTACT@{ shape: lean-r, label: "Infected by, Street, Zip code, City, Lastname" }-->B0
            B0[Create contacts of type 'infected_by'] --> B1[Create contacts of type 'same_address_and_last_name'] --> B2[Create contacts of type 'same_address']
        end
    end
```

### Samples (Sequences)

Samples provide mappings between cases and the corresponding sequenced genome. It is worth noting that not every case
has to be sequenced, as Gentrain can also provide valuable inferences based on contact tracing information. However, it
is the genetic information that makes gentrain what it is!

Whenever communicating with the server fasta ids are pseudomized using UUIDv4 values ([RFC9562](https://www.rfc-editor.org/rfc/rfc9562.html#name-example-of-a-uuidv4-value){:target="\_blank"}).

#### Fasta File Format

##### Viral Fasta Format

A fasta file containing the sequences identified by so-called fasta ids is required to import samples. Each fasta file contains several sequences that can be imported simultaneously. The upload of multiple files is not supported for virus samples.

```title="sequences.fasta"
    >{fasta_id_1}
    {sequence_1}
    >{fasta_id_2}
    {sequence_2}
    ...
    >{fasta_id_n}
    {sequence_n}

```

##### Bacterial Fasta Format

Bacterial genomes are provided in the form of assemblies since they consist of a genome sequence as well as a plasmid sequence. In addition, it is not a trivial task to assemble coherent bacterial sequences, which results in several contigs that combine to form the entire sequence. Each contig is characterised by an individual header whose information is not of interest for our use case. For bacterial samples, the fasta id must be represented by the name of the fasta file. The upload of multiple files is supported for bacterial samples.

```title="{fasta_id}.fasta"
    >{assembly_contig_header_1}
    {assembly_contig_sequence_1}
    >{assembly_contig_header_2}
    {assembly_contig_sequence_2}
    ...
    >{assembly_contig_header_n}
    {assembly_contig_sequence_n}

```

#### Sequence Processing

Genetic distances are calculated between all samples, which are then assembled in a distance matrix. This distance
matrix enables
to create a minimum spanning tree for the cases based on the genetic distance. The procedure is slightly different for
viral and bacterial samples.

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

### Contact Person Processes

Contact person processes provide information about which cases were in contact with each other. This information extends the contact information we extract from addresses and names. The import of contact persons leads to contact edges that are labelled 'Contact person'.

| Field     | Naming options | Description                                                | Required |
| --------- | -------------- | ---------------------------------------------------------- | -------- |
| Case id 1 | `Fall ID 1`    | Unique ID of the first case of the contact person process  | ✅       |
| Case id 2 | `Fall ID 2`    | Unique ID of the second case of the contact person process | ✅       |

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
        string case_id
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
        int sample_id_1
        int sample_id_2
        int value
        datetime created_at
        datetime updated_at
    }
    Distance }o--|| "Distance Matrix" : ""

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

    Sample {
        int id
        string fasta_id
        int n_count
        int sequence_length
        string lineage
        datetime created_at
        datetime updated_at
    }
    Sample ||--|| Case : ""
    Sample ||--|| "Sequence Analysis" : ""

    "Sequence Analysis" {
        int id
        object result
        string schema
        string version
        datetime created_at
        datetime updated_at
    }

    "Sequence Identifiers" {
        uuidv4 id
        string fasta_id
        datetime created_at
        datetime updated_at
    }
    "Sequence Identifiers" }o--|| Pathogen : ""
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
        string email
        string password
        boolean active
        datetime confirmed
        string fs_uniquifier
        datetime created_at
        datetime updated_at
    }
    User ||--o{ Role : ""
```
