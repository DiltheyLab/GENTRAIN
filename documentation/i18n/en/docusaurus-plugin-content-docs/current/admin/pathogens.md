---
title: Pathogen Management

sidebar_position: 3
---

In the admin panel, under the **`Pathogen`** tab, you will find all functions related to managing pathogens.  
Here you can create, edit, or activate pathogens, as well as upload analysis schemes and sample data.

## Creating Pathogens

1. In the **`Pathogen`** tab, open the overview and click **`Create new`**.
2. Fill out the required fields **`Name`**, **`Type`**, and **`Genetic Distance Threshold`**.
   - You can choose between the pathogen types **`Viral`** and **`Bacterial`**. Depending on the selection, different analysis scripts are executed to determine mutations within genome sequences.
   - The genetic distance threshold (**`Genetic Distance Threshold`**) specifies the distance at which a direct infection between two cases can be assumed.
3. Set the pathogen to “active” or “inactive”. Only active pathogens are available in the GENTRAIN application.
4. Upload the appropriate analysis scheme. The structure of the scheme depends on the selected pathogen type, and the content depends on the pathogen itself. Further information can be found under <i>TODO: add link to pathogen scheme</i>.
5. You may also upload sample data. These can later be downloaded via the GENTRAIN data management section for the currently active pathogen.
6. Confirm your entries by clicking “Save”.

## Editing Pathogens

Aside from the chosen pathogen type, you can edit pathogens afterward. Schemes cannot be deleted, only replaced by another.

## Analysis Schemes

For the analysis of genome sequences, schemes serve as reference data for the imported sequence data. Because viruses and bacteria use different scripts for mutation detection, their schemes differ in structure. Schemes must be uploaded as a ZIP file, which is then extracted on the server. To ensure system security, ZIP files undergo strict validation.

Uploaded ZIP files must not exceed 300 MB, and the extracted data must not exceed 8 GB. The system always ensures that there is sufficient free storage space available after extraction. If you need more storage space, please contact your hosting provider.

### Viruses
| File / Element     | Purpose                                                                                                                                              | Required |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `pathogen.json`    | Metadata about the pathogen, clades/lineages, version info, specification of the reference genome file (`reference.fasta`)                           | ✅        |
| `reference.fasta`  | Reference genome for alignment and mutation calling. A possible source for reference genomes is, for example, the [NCBI genome database](https://www.ncbi.nlm.nih.gov/datasets/genome/). | ✅        |
| `tree.json`        | Phylogenetic tree / clade structure                                                                                                                  |          |

### Bacteria
| File / Element       | Purpose                                               | Required                                        |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| `.genes_list`        | List of all loci in the scheme                        | ✅                                                |
| `.schema_config`     | Configuration and metadata of the scheme              | ✅                                                |
| `loci_modes`         | Defines the calling mode per locus                    | ✅                                                |
| `self_scores`        | Quality and similarity scoring for alleles            |                                                  |
| `*.fasta`            | All alleles of a locus in the main scheme             | Files listed in `.genes_list` must be included.  |
| `short/*.fasta`      | Reduced/representative alleles for the short scheme   | Files listed in `.genes_list` must be included.  |
| `short/self_scores`  | Scoring table for the short scheme                    |                                                  |

## Example Data

Example files can be provided for the various imports in the application. Regardless of pathogen type, case data and contact data must be uploaded in CSV format. The structure of these files can be found in the [Data Import](http://localhost:3001/docs/application/data-management/general#datenimport) section of the “Data Management” area of the application documentation. After saving the pathogen, the files are checked for correctness and security vulnerabilities.