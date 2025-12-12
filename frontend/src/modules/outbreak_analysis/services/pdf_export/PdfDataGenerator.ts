import { CoreStore, useCoreStore } from "@/modules/core/stores/core";
import { OutbreakAnalysisStore, useOutbreakAnalysisStore } from "../../stores/outbreakAnalysis";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { ClusterAnalyser } from "@/modules/core/services/graph/ClusterAnalyser";
import { CustomNode, GraphData } from "@/modules/core/types/graph";
import html2canvas from "html2canvas";
import { PathogenTypeName } from "@/modules/core/models/pathogen_types";
import { getSelectedClusters } from "@/modules/core/helpers/graphs";
import { t } from "i18next";
import { concat } from "lodash";
import { BacterialAnalysisResult, ViralAnalysisResult } from "@/modules/core/models/sequence_analyses";

export class PdfDataGenerator {
    protected coreStore: CoreStore;
    protected outbreakAnalysisState: OutbreakAnalysisStore;
    protected graphData: GraphData;

    protected allCases: CaseWithRelationships[];
    protected clusters: (CustomNode | undefined)[][];
    protected distantCasesOfSelectedOutbreak: (CustomNode | undefined)[];
    protected distantClustersOfSelectedOutbreak: { outbreakCase: CustomNode; otherCases: (CustomNode | undefined)[] }[];
    protected clustersContainingCasesOfSelectedOutbreak: number;

    constructor() {
        this.coreStore = useCoreStore.getState();
        this.outbreakAnalysisState = useOutbreakAnalysisStore.getState();
        this.graphData = this.collectGraphData();
        this.allCases = [];
        this.clusters = this.getClusters();
        this.distantCasesOfSelectedOutbreak = [];
        this.distantClustersOfSelectedOutbreak = [];
        this.clustersContainingCasesOfSelectedOutbreak = 0;
    }

    public getGraphData = () => {
        return this.graphData;
    };

    public generateSummary = () => {
        const selectedClusters = getSelectedClusters();
        const caseCountWithoutOutbreak = this.outbreakAnalysisState.graphData.nodes.filter(
            (node) => !node.caseData.outbreak
        ).length;

        const summary = `Der analysierte Datensatz umfasst Falldaten des ${
            this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? "viralen" : "bakteriellen"
        } Pathogens ${this.coreStore.activePathogen?.name}.\n\n`;

        return `${summary}${this.getSummaryPhraseForSelectedOutbreakCases()}${this.getSummaryPhraseForOtherOutbreakCases(
            selectedClusters.selectedBackground,
            caseCountWithoutOutbreak
        )}${this.getSummaryPhraseForUnassignedCases(
            caseCountWithoutOutbreak
        )}${this.getSummaryPhraseForContactLinks()}`;
    };

    public generateGraphImage = async () => {
        const graphElement = document.querySelector(".pdf-graph") as HTMLDivElement;
        const graphCanvasElement = await html2canvas(graphElement);
        const graphImageDataURL = graphCanvasElement.toDataURL("image/jpeg", 1.0);
        return graphImageDataURL;
    };

    public getGraphImageDescription = () => {
        const allContactTracingLinks = this.outbreakAnalysisState.graphData.links.filter(
            (link) => link.type !== t(`linkTypes.geneticDistance`)
        );
        return `Abbildung 1: Minimum Spanning Tree (MST) der analysierten Fälle. Jeder Knoten im MST repräsentiert einen gemeldeten Fall; Knoten-Farben zeigen den Falltyp an (Umgebungsproben oder als potentiellen Ausbruch gekennzeichnete Proben). Genetische Abstände zwischen den sequenzierten ${
            this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.viral ? "viralen" : "bakteriellen"
        } Genomen werden über graue Kanten zwischen Punkten visualisiert, die mit dem jeweiligen genetischen Abstand beschriftet sind. ${
            allContactTracingLinks.length > 0 && " Kontakte zwischen Fällen sind durch farbliche Kanten repräsentiert."
        } Zahlen in den Knoten beziehen sich auf die Spalte "Fall-Nummer im MST" in Tabelle 1.`;
    };

    public generateConclusion = () => {
        let conclusion = "";
        const mergedClusterCases = concat(...this.clusters).map((customNode) => customNode?.caseData.case_id);

        // Clusters without appearance of a case of the selected outbreak
        this.distantCasesOfSelectedOutbreak = this.outbreakAnalysisState.graphData.nodes.filter((customNode) => {
            return (
                customNode.caseData.outbreak_id === this.outbreakAnalysisState.analysisSettings.selectedOutbreak?.id &&
                !mergedClusterCases.includes(customNode.caseData.case_id) &&
                customNode.caseData.fasta_id
            );
        });

        for (const index in this.clusters) {
            const cluster = this.clusters[index];
            const selectedOutbreakCasesInCluster = cluster.filter(
                (node) =>
                    node?.caseData.outbreak_id === this.outbreakAnalysisState.analysisSettings.selectedOutbreak?.id
            );
            if (selectedOutbreakCasesInCluster.length === 0) {
                continue;
            }
            if (selectedOutbreakCasesInCluster.length === 1 && selectedOutbreakCasesInCluster[0]) {
                const otherCasesInCluster = cluster.filter(
                    (node) =>
                        node?.caseData.outbreak_id !== this.outbreakAnalysisState.analysisSettings.selectedOutbreak?.id
                );
                this.distantClustersOfSelectedOutbreak.push({
                    outbreakCase: selectedOutbreakCasesInCluster[0],
                    otherCases: otherCasesInCluster,
                });
                continue;
            }
            this.clustersContainingCasesOfSelectedOutbreak++;
            conclusion +=
                this.getConclusionPhraseForSelectedOutbreakCasesInCluster(
                    selectedOutbreakCasesInCluster,
                    parseInt(index)
                ) + this.getConclusionPhraseForSubgroupInCluster(cluster);
        }
        return `${conclusion}${this.getConclusionPhraseForDistantClustersOfSelectedOutbreak()}${this.getConclusionPhraseForDistantCasesOfSelectedOutbreak()}${this.getConclusionPhraseForOutro()}`.trim();
    };

    getCaseDataTableColumns = () => {
        const columns = ["Fall-Nummer im MST", "Sequenz-ID", "Vermuteter Ausbruch"];
        if (this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.viral) {
            columns.push("Ns", "IUPAC Ambiguity Characters", "Abstammung");
        }
        if (this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial) {
            columns.push("Contigs", "Länge erster Contig", "Unbestimmbare Gene");
        }
        return columns;
    };

    public getCaseDataTableRows = () => {
        const rows: (string | number)[][] = [];
        this.outbreakAnalysisState.graphData.nodes.map((node) => {
            const cells: (string | number)[] = [
                node.index ?? "-",
                node.caseData.fasta_id ?? "-",
                node.caseData.outbreak?.name ?? "-",
            ];
            if (this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.viral) {
                const viralSequenceAnalysisResult = node.caseData.sequence_analysis?.result as
                    | ViralAnalysisResult
                    | undefined;
                cells.push(
                    viralSequenceAnalysisResult?.n_count ?? "-",
                    viralSequenceAnalysisResult?.ambiguity_character_count ?? "-",
                    viralSequenceAnalysisResult?.lineage ?? "-"
                );
            }
            if (this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial) {
                const bacterialSequenceAnalysisResult = node.caseData.sequence_analysis?.result as
                    | BacterialAnalysisResult
                    | undefined;
                cells.push(
                    bacterialSequenceAnalysisResult?.contig_count ?? "-",
                    bacterialSequenceAnalysisResult?.first_contig_length ?? "-",
                    bacterialSequenceAnalysisResult?.undeterminable_gen_count ?? "-"
                );
            }
            rows.push(cells);
        });
        return rows;
    };

    private collectGraphData() {
        const graphDataClone = structuredClone(this.outbreakAnalysisState.graphData);
        graphDataClone.links = graphDataClone.links.map((link) => {
            link.source = (link.source as unknown as CustomNode).id;
            link.target = (link.target as unknown as CustomNode).id;
            return link;
        });
        return graphDataClone;
    }

    private getClusters = () => {
        const clusterAnalyses = new ClusterAnalyser(
            this.graphData.nodes,
            this.graphData.links,
            this.coreStore.activePathogen?.genetic_distance_threshold ?? 0
        );
        return clusterAnalyses.getClusters();
    };

    private getSummaryPhraseForSelectedOutbreakCases = () => {
        const casesInSelectedOutbreak = this.outbreakAnalysisState.graphData.nodes.filter(
            (node) => node.caseData.outbreak_id === this.outbreakAnalysisState.analysisSettings.selectedOutbreak?.id
        );
        return `Es existieren ${casesInSelectedOutbreak.length} ${
            casesInSelectedOutbreak.length > 1 ? "Fälle" : "Fall"
        } des zu untersuchenden vermuteten Ausbruchs "${
            this.outbreakAnalysisState.analysisSettings.selectedOutbreak?.name
        }"`;
    };

    private getSummaryPhraseForOtherOutbreakCases = (
        selectedBackgroundNames: string[],
        caseCountWithoutOutbreak: number
    ) => {
        let summaryPhraseForOtherOutbreakCases = "";
        selectedBackgroundNames.forEach((clusterName: string, index: number) => {
            const caseCountInCluster = this.outbreakAnalysisState.graphData.nodes.filter(
                (node) => node.caseData.outbreak?.name === clusterName
            ).length;
            if (caseCountInCluster === 0) {
                return;
            }
            summaryPhraseForOtherOutbreakCases += `${
                index === selectedBackgroundNames.length - 1 && caseCountWithoutOutbreak === 0 ? " sowie " : ", "
            } ${caseCountInCluster} ${
                caseCountInCluster > 1 ? "Fälle" : "Fall"
            } des vermuteten Ausbruchs "${clusterName}"`;
        });
        return summaryPhraseForOtherOutbreakCases;
    };

    private getSummaryPhraseForUnassignedCases = (caseCountWithoutOutbreak: number) => {
        return `${
            caseCountWithoutOutbreak > 0
                ? ` sowie ${caseCountWithoutOutbreak} ${
                      caseCountWithoutOutbreak > 1 ? "Fälle" : "Fall"
                  } aus der Umgebung ohne Ausbruchszuweisung.`
                : "."
        }`;
    };

    private getSummaryPhraseForContactLinks = () => {
        const allContactTracingLinks = this.outbreakAnalysisState.graphData.links.filter(
            (link) => link.type !== t(`linkTypes.geneticDistance`)
        );
        if (allContactTracingLinks.length === 0) {
            return "";
        }
        return `\n\nEs sind ${allContactTracingLinks.length} Kontaktangaben aus der Kontaktnachverfolgung enthalten.`;
    };

    private getConclusionPhraseForSelectedOutbreakCasesInCluster = (
        cases: (CustomNode | undefined)[],
        clusterIndex: number
    ) => {
        return `Die ${cases.length} Proben ${cases
            .map(
                (node, index) =>
                    `${node?.caseData.fasta_id} (${index === 0 ? `Fall-Nummer ${node?.index} im MST` : node?.index})`
            )
            .join(", ")
            .replace(
                /,([^,]*)$/,
                " und$1"
            )} des untersuchten vermuteten Ausbruchs bilden ein Cluster und sind untereinander genetisch identisch bzw. nah verwandt ${
            clusterIndex === 0
                ? `(minimaler paarweiser genetischer Abstand von ≤ ${this.coreStore.activePathogen?.genetic_distance_threshold})`
                : ""
        }.${" "}`;
    };

    private getConclusionPhraseForSubgroupInCluster = (cluster: (CustomNode | undefined)[]) => {
        const otherOutbreakCasesInCluster = cluster.filter(
            (node) =>
                node?.caseData.outbreak_id &&
                node?.caseData.outbreak_id !== this.outbreakAnalysisState.analysisSettings.selectedOutbreak?.id
        );
        const unassignedCasesInCluster = cluster.filter((node) => !node?.caseData.outbreak_id);

        if (otherOutbreakCasesInCluster.length + unassignedCasesInCluster.length === 0) {
            return "";
        }

        // In case there is only one additional genetic connection to the investigated outbreak,
        // immediately return a conclusion sentences without taking the latter operations of the
        // method into account.
        if (otherOutbreakCasesInCluster.length === 1 && unassignedCasesInCluster.length === 0) {
            return `Es gibt mit ${otherOutbreakCasesInCluster[0]?.caseData.fasta_id} (${otherOutbreakCasesInCluster[0]?.index}) zudem eine Probe des vermuteten Ausbruchs "${otherOutbreakCasesInCluster[0]?.cluster}" die genetisch nah verwandt zu den untersuchten Ausbruchsproben innerhalb des Clusters ist.`;
        }
        if (unassignedCasesInCluster.length === 1 && otherOutbreakCasesInCluster.length === 0) {
            return `Es gibt mit ${unassignedCasesInCluster[0]?.caseData.fasta_id} (${unassignedCasesInCluster[0]?.index}) zudem eine Probe ohne Ausbruchszuweisung die genetisch nah verwandt zu den untersuchten Ausbruchsproben innerhalb des Clusters ist.`;
        }

        let conclusionString = `Es gibt zudem ${otherOutbreakCasesInCluster.length + unassignedCasesInCluster.length} weitere Proben die genetisch nah verwandt zu den untersuchten Ausbruchsproben innerhalb des Clusters sind. Darunter sind `;
        conclusionString += this.getConclusionPhraseForOtherOutbreakCasesInCluster(otherOutbreakCasesInCluster);

        // Add a connection between both statements if there are connection with other outbreak cases or unassigned cases
        if (otherOutbreakCasesInCluster.length > 0 && unassignedCasesInCluster.length > 0) {
            conclusionString += " und ";
        }
        conclusionString += this.getConclusionPhraseForUnassignedCasesInCluster(unassignedCasesInCluster);
        conclusionString += ".";
        return conclusionString;
    };

    private getConclusionPhraseForOtherOutbreakCasesInCluster = (cases: (CustomNode | undefined)[]) => {
        if (cases.length === 0) {
            return "";
        }
        const groupedCases: { [outbreakName: string]: CustomNode[] } = cases.reduce((r: any, node: any) => {
            r[node.cluster] = r[node.cluster] || [];
            r[node.cluster].push(node);
            return r;
        }, Object.create(null));
        return `${Object.keys(groupedCases)
            .map((key) => {
                return `mit ${groupedCases[key]
                    .map((node) => `${node.caseData.fasta_id} (${node.index})`)
                    .join(", ")
                    .replace(/,([^,]*)$/, " und$1")} ${groupedCases[key].length} Probe${
                    groupedCases[key].length > 1 ? "n" : ""
                } des vermuteten Ausbruchs "${key}"`;
            })
            .join(", ")
            .replace(/,([^,]*)$/, " und$1")}`;
    };

    private getConclusionPhraseForUnassignedCasesInCluster = (cases: (CustomNode | undefined)[]) => {
        if (cases.length === 0) {
            return "";
        }
        return `mit ${cases
            .map((node) => `${node?.caseData.fasta_id} (${node?.index})`)
            .join(", ")
            .replace(/,([^,]*)$/, " und$1")} ${cases.length} Proben ohne Ausbruchszuweisung`;
    };

    private getConclusionPhraseForDistantClustersOfSelectedOutbreak = () => {
        let conclusion = "";
        for (const distantCluster of this.distantClustersOfSelectedOutbreak) {
            conclusion += `\n\nDie Probe ${distantCluster.outbreakCase.caseData.fasta_id} (${distantCluster.outbreakCase.index}) des untersuchten vermuteten Ausbruchs weist eine genetische Distanz von > ${this.coreStore.activePathogen?.genetic_distance_threshold} zu allen anderen untersuchten Ausbruchsproben auf, weshalb sie genetisch nicht nah verwandt mit diesen ist. Allerdings gibt es mit ${distantCluster.otherCases
                .map((node) => {
                    return `${node!.caseData.fasta_id} (${node!.index})`;
                })
                .join(", ")
                .replace(/,([^,]*)$/, " und$1")} ${distantCluster.otherCases.length} Probe${
                distantCluster.otherCases.length > 1 ? "n" : ""
            } die zu dieser Probe genetisch nah verwandt sind und somit ein Cluster bilden.`;
        }

        return conclusion;
    };

    private getConclusionPhraseForDistantCasesOfSelectedOutbreak = () => {
        if (this.distantCasesOfSelectedOutbreak.length === 0) {
            return "";
        }

        return `\n\nDie Probe ${
            this.distantCasesOfSelectedOutbreak.length > 1 ? "n" : ""
        } ${this.distantCasesOfSelectedOutbreak
            .map((node) => `${node?.caseData.fasta_id} (${node?.index})`)
            .join(", ")
            .replace(/,([^,]*)$/, " und$1")} des untersuchten vermuteten Ausbruchs ${
            this.distantCasesOfSelectedOutbreak.length > 1 ? "weisen jeweils" : "weist"
        } eine genetische Distanz von > ${
            this.coreStore.activePathogen?.genetic_distance_threshold
        } zu allen anderen untersuchten Ausbruchsproben auf, weshalb sie genetisch nicht nah verwandt mit diesen ${
            this.distantCasesOfSelectedOutbreak.length > 1 ? "sind" : "ist"
        }.`;
    };

    private getConclusionPhraseForOutro = () => {
        const casesInSelectedOutbreak = this.outbreakAnalysisState.graphData.nodes.filter(
            (node) => node.caseData.outbreak_id === this.outbreakAnalysisState.analysisSettings.selectedOutbreak?.id
        );
        if (casesInSelectedOutbreak.length === this.distantCasesOfSelectedOutbreak.length) {
            return "\n\nDamit sind die analysierten genetischen Daten nicht konsistent mit einem Ausbruchs- bzw. klonalen Übertragungsereignis zwischen den untersuchten Ausbruchsproben.";
        }
        return `\n\nDamit sind die analysierten genetischen Daten konsistent mit einem Ausbruchs - bzw. klonalen Übertragungsereignis zwischen den genetisch nah verwandten Proben de${
            this.clustersContainingCasesOfSelectedOutbreak > 1 ? "r" : "s"
        } identifizierten Cluster${this.clustersContainingCasesOfSelectedOutbreak > 1 ? "" : "s"}, unter einer möglichen Beteiligung der genetisch nah verwandten Umgebungsproben innerhalb de${
            this.clustersContainingCasesOfSelectedOutbreak > 1 ? "r" : "s"
        } Cluster${this.clustersContainingCasesOfSelectedOutbreak > 1 ? "" : "s"}.`;
    };
}
