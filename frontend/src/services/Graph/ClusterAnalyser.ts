import { CustomNode, GraphData } from "@/types/graph";
import i18next from "i18next";

export class ClusterAnalyser {
    private clusteringThreshold: number;
    private minClusterSize: number;
    private adjacencyList: { [key: number]: number[] };

    constructor(clusteringThreshold: number, minClusterSize = 2) {
        this.clusteringThreshold = clusteringThreshold;
        this.minClusterSize = minClusterSize;
        this.adjacencyList = {};
    }

    public getClusteredGraphData = (graphData: GraphData): GraphData => {
        const clusters = this.findClusters(graphData);
        const nodes = this.assignClusterNamesToNodes(graphData, clusters);
        return { nodes, links: graphData.links };
    };

    private findClusters = (graphData: GraphData) => {
        this.buildAdjacencyList(graphData);

        //all connected nodes build a component
        const components = this.getConnectedComponents();

        //all components above the clusteringThreshold build a cluster
        const cluster = this.filterClustersBySize(components);

        return cluster;
    };

    private assignClusterNamesToNodes = (graphData: GraphData, clusters: number[][]): CustomNode[] => {
        //create the components map where the key is the case id and the value is the cluster name
        const componentsMap = new Map<number, string>();
        for (let i = 0; i < clusters.length; i++) {
            for (let j = 0; j < clusters[i].length; j++) {
                componentsMap.set(clusters[i][j], `Cluster ${i + 1}`);
            }
        }

        //overwrite the clusters name. If there is no key for the case id in the components map, the node belongs not to a cluster
        return graphData.nodes.map((node) => {
            return { ...node, cluster: componentsMap.get(node.id) ?? i18next.t("clusterTypes.noClusterAssigned") };
        });
    };

    private buildAdjacencyList = (graphData: GraphData): void => {
        const linksBelowThreshold = graphData.links.filter((link) => +link.value <= this.clusteringThreshold);
        graphData.nodes.forEach((node) => {
            this.addNodeToAdjacencyList(node.id);
        });
        linksBelowThreshold.forEach((link) => this.addLinkToAdjacencyList(link.source, link.target));
    };

    private getConnectedComponents = (): number[][] => {
        const visited = new Set<number>();
        const components: number[][] = [];

        const dfs = (node: number, component: number[]): void => {
            visited.add(node);
            component.push(node);

            this.adjacencyList[node].forEach((neighbor) => {
                if (!visited.has(neighbor)) {
                    dfs(neighbor, component);
                }
            });
        };

        for (const node in this.adjacencyList) {
            if (!visited.has(Number(node))) {
                const component: number[] = [];
                dfs(Number(node), component);
                components.push(component);
            }
        }

        return components;
    };

    private filterClustersBySize = (components: number[][]): number[][] => {
        return components.filter((component) => component.length >= this.minClusterSize);
    };

    private addNodeToAdjacencyList = (node: number): void => {
        if (!this.adjacencyList[node]) {
            this.adjacencyList[node] = [];
        }
    };

    private addLinkToAdjacencyList = (node1: number, node2: number): void => {
        this.adjacencyList[node1].push(node2);
        this.adjacencyList[node2].push(node1);
    };
}
