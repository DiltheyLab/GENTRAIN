# Data Management

Outbreak analysis are based on *Minimum Spanning Tree (MST)*  visualizations of infection cases, which are connected by
genetic
distances or contact tracing events. These MSTs are reliant on an imported dataset consisting of cases, sequenced
samples and
contact information.

## File Imports

### Cases

Cases are registered infection reports from the health authorities.
These are recorded using the <a href="https://www.rki.de/DE/Content/Infekt/IfSG/Software/software_inhalt.html" target="_
blank">SurvNet software</a> developed by the RKI. To import case data from the SurvNet a CSV structure with relevant
fields was constructed:

| Fall ID                | Sequenz ID (optional)                  | Registrierungsdatum              | Ausbruch                       | Flexible Kategorie 1                          | Flexible Kategorie 2                          | Flexible Kategorie 3                          |
|------------------------|----------------------------------------|----------------------------------|--------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|
| SurvNet ID of the case | Fasta ID of the corresponding sequence | Date of registration in SurvNets | Suspected outbreak association | Flexible category for further differentiation | Flexible category for further differentiation | Flexible category for further differentiation |

### Samples

Samples provide mappings between cases and the corresponding sequenced genome. It is worth noting that not every case
has to be sequenced, as Gentrain can also provide valuable inferences based on contact tracing information. However, it
is the genetic information that makes gentrain what it is!

A fasta file containing the sequences identified by so-called fasta IDs is required to import samples.
Genetic distances are calculated between all samples, which are then assembled in a distance matrix. This distance matrix enables
to create a minimum spanning tree for the cases based on the genetic distance. The procedure is slightly different for viral and bacterial samples.

```mermaid
graph LR
A[<b>User Input</b>]-->B[<b><a href='#sequence-analysis' style="text-decoration: none;">Sequence Analysis</a></b>]
B -->C[<b><a href='#distance-calculation' style="text-decoration: none;">Distance Calculation</a></b>]
C -->D[<b><a href='#distance-matrix' style="text-decoration: none;">Distance Matrix</a></b>]
```

### Contacts

WIP

## Sequence Analysis

In order to calculate genetic distances between viral and bacterial genome we analyse genetic sequences against their
reference genome. This way we manage to persist a minified data structure without significant information loss. Since
viral sequences are generally available in their entirety and bacterial sequences are usually sequenced in assemblies,
different analysis techniques are applied.

### Viral Sequence Analysis

#### Mutation Calling

For viral sequences we determine mutations based on the corresponding reference genome, which is done using the
<a href="https://docs.nextstrain.org/projects/nextclade/en/stable/user/nextclade-cli/index.html" target="_blank">
Nextclade CLI</a>.
Nextclade provides mutation objects consisting of snps, insertions, deletions, Ns and nonACGTN-characters.
These mutation objects enable us to calculate genetic distances without persisting whole sequences.

### Bacterial Sequence Analysis

#### Allele Calling

Bacterial sequences are analysed using chewBACCA. According to its own docs "chewBBACA is a software suite for the
creation and evaluation of core genome and whole genome MultiLocus Sequence Typing (cg/wgMLST) schemas and results". For
Gentrain, we use <a href="https://chewbbaca.readthedocs.io/en/latest/user/modules/AlleleCall.html" target="_blank">
chewBACCA's AlleleCall
service</a>
which provides mappings between each gene and the corresponding
allele in the sequences. Based on these mappings, we then calculate genetic distances by differentiating between the
allele sets of two sequences.

### UML Sequence Diagram

```mermaid
sequenceDiagram
    participant IndexedDB
    participant React
    participant Flask
    participant Viral Queue
    participant Bacterial Queue
    participant NextcladeCLI
    participant chewBACCA
    React->>React: init session
    React->>Flask: message: join viral room
    Flask->>React: message: confirm viral room joined
    loop for all sequences
        React->>React: create pseudonym for sequence
        React->>Flask: message: sequence analysis request
        alt Viral Sequence
            Flask->>Viral Queue: enqueue: sequence analysis job
            Viral Queue->>NextcladeCLI: execute: sequence analysis job
            activate NextcladeCLI
            NextcladeCLI-->>Viral Queue: sequence analysis result
            deactivate NextcladeCLI
            Viral Queue->>React: message: sequence analysis result
        else Bacterial Sequence
            Flask->>Bacterial Queue: enqueue: sequence analysis job
            Bacterial Queue->>chewBACCA: execute: sequence analysis job
            activate chewBACCA
            chewBACCA-->>Bacterial Queue: sequence analysis result
            deactivate chewBACCA 
            Bacterial Queue->>React: message: sequence analysis result
        end  
        React->>IndexedDB: persist: sample and sequence analysis result
    end
    React->>Flask: message: close viral room
```

## Distance Calculation

WIP

## Distance Matrix

WIP