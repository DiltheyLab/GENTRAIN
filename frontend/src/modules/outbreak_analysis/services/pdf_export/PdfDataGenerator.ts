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

export class PdfDataGenerator {
    protected coreStore: CoreStore;
    protected outbreakAnalysisState: OutbreakAnalysisStore;
    protected graphData: GraphData;

    protected allCases: CaseWithRelationships[];
    protected clusters: (CustomNode | undefined)[][];
    protected distantCasesOfSelectedOutbreak: (CustomNode | undefined)[];
    protected clustersContainingCasesOfSelectedOutbreak: number;

    constructor() {
        this.coreStore = useCoreStore.getState();
        this.outbreakAnalysisState = useOutbreakAnalysisStore.getState();
        this.graphData = this.collectGraphData();
        this.allCases = [];
        this.clusters = this.getClusters();
        this.distantCasesOfSelectedOutbreak = [];
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
        )}${this.getSummaryPhraseForSampleQuality()}${this.getSummaryPhraseForContactLinks()}`;
    };

    public generateGraphImage = async () => {
        const graphElement = document.querySelector(".pdf-graph") as HTMLDivElement;
        const graphCanvasElement = await html2canvas(graphElement);
        const graphImageDataURL = graphCanvasElement.toDataURL("image/jpeg", 1);
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
                this.distantCasesOfSelectedOutbreak.push(selectedOutbreakCasesInCluster[0]);
                continue;
            }
            this.clustersContainingCasesOfSelectedOutbreak++;
            conclusion +=
                this.getConclusionPhraseForSelectedOutbreakCasesInCluster(
                    selectedOutbreakCasesInCluster,
                    parseInt(index)
                ) + this.getConclusionPhraseForSubgroupInCluster(cluster);
        }
        return `${conclusion}${this.getConclusionPhraseForDistantCasesOfSelectedOutbreak()}${this.getConclusionPhraseForOutro()}`;
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
                node.caseData.sample?.fasta_id ?? "-",
                node.caseData.outbreak?.name ?? "-",
            ];
            if (this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.viral) {
                cells.push(
                    node.caseData.sample?.n_count ?? 0,
                    node.caseData.sample?.ambiguity_character_count ?? 0,
                    node.caseData.sample?.lineage ?? "-"
                );
            }
            if (this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.bacterial) {
                cells.push(
                    node.caseData.sample?.contig_count ?? 0,
                    node.caseData.sample?.first_contig_length ?? 0,
                    node.caseData.sample?.undeterminable_gen_count ?? 0
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

    private getSummaryPhraseForSampleQuality = () => {
        const samples = this.outbreakAnalysisState.graphData.nodes.filter((node) => node.caseData.sample);
        const samplesWithLowAmountOfNs = samples.filter(
            (node) => node.caseData.sample?.n_count && node.caseData.sample?.n_count < 1500
        );
        return `\n\nFür ${samples.length} von ${
            this.outbreakAnalysisState.graphData.nodes.length
        } Fällen liegen genetische Sequenzdaten vor${
            this.coreStore.activePathogen?.pathogen_type?.name === PathogenTypeName.viral
                ? `, wobei ${samplesWithLowAmountOfNs.length} von ${samples.length} Genomen fast perfekt (< 1500 Ns) aufgelöst sind`
                : ""
        }.`;
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

        if (otherOutbreakCasesInCluster.length === 1) {
            return `Es gibt mit ${otherOutbreakCasesInCluster[0]?.caseData.fasta_id} (${otherOutbreakCasesInCluster[0]?.index}) zudem eine Probe des vermuteten Ausbruchs "${otherOutbreakCasesInCluster[0]?.cluster}" die genetisch nah verwandt zu den untersuchten Ausbruchsproben innerhalb des Clusters ist.`;
        }
        if (unassignedCasesInCluster.length === 1) {
            return `Es gibt mit ${unassignedCasesInCluster[0]?.caseData.fasta_id} (${unassignedCasesInCluster[0]?.index}) zudem eine Probe aus der Umgebung des Ausbruchs die genetisch nah verwandt zu den untersuchten Ausbruchsproben innerhalb des Clusters ist.`;
        }
        return `Es gibt zudem eine Untergruppe von ${
            otherOutbreakCasesInCluster.length + unassignedCasesInCluster.length
        } weiteren Proben die genetisch nah verwandt zu den untersuchten Ausbruchsproben innerhalb des Clusters sind. ${this.getConclusionPhraseForOtherOutbreakCasesInCluster(
            otherOutbreakCasesInCluster
        )} ${this.getConclusionPhraseForUnassignedCasesInCluster(unassignedCasesInCluster)}`;
    };

    private getConclusionPhraseForOtherOutbreakCasesInCluster = (cases: (CustomNode | undefined)[]) => {
        const groupedCases: { [outbreakName: string]: CustomNode[] } = cases.reduce((r: any, node: any) => {
            r[node.cluster] = r[node.cluster] || [];
            r[node.cluster].push(node);
            return r;
        }, Object.create(null));
        return `Darunter sind ${Object.keys(groupedCases)
            .map((key) => {
                return ` mit ${groupedCases[key]
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
        return `${
            cases.length === 0
                ? "."
                : `und mit ${cases
                      .map((node) => `${node?.caseData.fasta_id} (${node?.index})`)
                      .join(", ")
                      .replace(/,([^,]*)$/, " und$1")} ${cases.length} Proben ohne Ausbruchszuweisung.`
        }`;
    };

    private getConclusionPhraseForDistantCasesOfSelectedOutbreak = () => {
        if (this.distantCasesOfSelectedOutbreak.length === 0) {
            return "";
        }

        return `\n\nDie Probe${
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
        return `\n\nDamit sind die analysierten genetischen Daten konsistent mit einem Ausbruchs- bzw. klonalen Übertragungsereignis zwischen den genetisch nah verwandten untersuchten Ausbruchsproben de${
            this.clustersContainingCasesOfSelectedOutbreak === 1 ? "s" : "n"
        } identifizierten Cluster${
            this.clustersContainingCasesOfSelectedOutbreak === 1 ? "s" : ""
        }, unter einer möglichen Beteiligung der genetisch nah verwandten Umgebungsproben innerhalb de${
            this.clustersContainingCasesOfSelectedOutbreak === 1 ? "s" : "r"
        } Cluster${this.clustersContainingCasesOfSelectedOutbreak === 1 ? "s" : ""}.`;
    };
}
