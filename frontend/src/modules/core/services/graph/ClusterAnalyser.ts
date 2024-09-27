import { CustomLink, CustomNode } from "@/modules/core/types/graph";
import i18next from "i18next";
import { createNodeMap } from "../../helpers/cases";
import { CONTACT_LINK_VALUE } from "./GraphDataGenerator";

export class ClusterAnalyser {
    private clusteringThreshold: number;
    private minClusterSize: number;
    private adjacencyList: { [key: number]: number[] };
    private clusters: number[][];
    private nodes: CustomNode[];
    private links: CustomLink[];

    constructor(nodes: CustomNode[], links: CustomLink[], clusteringThreshold: number, minClusterSize = 2) {
        this.nodes = nodes;
        this.links = links;
        this.clusteringThreshold = clusteringThreshold;
        this.minClusterSize = minClusterSize;
        this.adjacencyList = {};
        this.clusters = this.findClusters();
    }

    public assignClusterNamesToNodes = (): CustomNode[] => {
        //create the components map where the key is the case id and the value is the cluster name
        const componentsMap = new Map<number, string>();
        for (let i = 0; i < this.clusters.length; i++) {
            for (let j = 0; j < this.clusters[i].length; j++) {
                componentsMap.set(this.clusters[i][j], `Cluster ${i + 1}`);
            }
        }

        //overwrite the clusters name. If there is no key for the case id in the components map, the node belongs not to a cluster
        return this.nodes.map((node) => {
            return { ...node, cluster: componentsMap.get(node.id) ?? i18next.t("clusterTypes.noClusterAssigned") };
        });
    };

    public getClusters = () => {
        const nodeMap = createNodeMap(this.nodes);
        return this.clusters.map((cluster) => cluster.map((id) => nodeMap.get(id)));
    };

    private findClusters = () => {
        this.buildAdjacencyList();
        //all connected nodes build a component
        const components = this.getConnectedComponents();
        //all components above the clusteringThreshold build a cluster
        const clusters = this.filterClustersBySize(components);
        return clusters;
    };

    private buildAdjacencyList = (): void => {
        const linksBelowThreshold = this.links.filter(
            (link) => link.value !== CONTACT_LINK_VALUE && link.value <= this.clusteringThreshold
        );
        this.nodes.forEach((node) => {
            this.addNodeToAdjacencyList(node.id);
        });

        linksBelowThreshold.forEach((link) =>
            this.addLinkToAdjacencyList(
                typeof link.source === "object" ? link.source.id : link.source,
                typeof link.target === "object" ? link.target.id : link.target
            )
        );
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
