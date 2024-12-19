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

To import samples a fasta-file is required which holds the sequences identifiered by so called fasta ids.

```mermaid
graph LR
A[<b>UserInput</b><br/>Fasta File Upload]-->B[<b>Sequence Analysis</b><br/>Viral and Bacterial]
B -->C[<b>Distance Calculation</b><br/>Viral and Bacterial]
C -->D[<b>Distance Matrix Assembling</b>]
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

#### Message Flow

![Viral Sequence Analysis](img/data_management/viral_sequence_analysis.png)

### Bacterial Sequence Analysis

#### Allele Calling

Bacterial sequences are analyses using chewBACCA. According to its own docs "chewBBACA is a software suite for the
creation and evaluation of core genome and whole genome MultiLocus Sequence Typing (cg/wgMLST) schemas and results". For
Gentrain, we use <a href="https://chewbbaca.readthedocs.io/en/latest/user/modules/AlleleCall.html" target="_blank">
chewBACCA's AlleleCall
service</a>
which provides mappings between each gene and the corresponding
allele in the sequences. Based on these mappings, we then calculate genetic distances by differentiating between the
allele sets of two sequences.

#### Message Flow

![Bacterial Sequence Analysis](img/data_management/bacterial_sequence_analysis.png)
