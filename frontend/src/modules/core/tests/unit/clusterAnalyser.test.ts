import { describe, expect, beforeEach, vi, it, afterEach } from "vitest";
import { CustomNode, CustomLink } from "@/modules/core/types/graph";
import { ClusterAnalyser } from "../../services/graph/ClusterAnalyser";
import i18next from "i18next";
import { CONTACT_LINK_VALUE } from "../../services/graph/GraphDataGenerator";
import { createNodeWithoutSequence, createNodeWithSequence } from "../entities/nodes";

describe("ClusterAnalyser", () => {
    let nodes: CustomNode[];
    let links: CustomLink[];

    beforeEach(() => {
        nodes = [
            createNodeWithSequence({ id: 1 }),
            createNodeWithSequence({ id: 2 }),
            createNodeWithSequence({ id: 3 }),
            createNodeWithSequence({ id: 4 }),
            createNodeWithSequence({ id: 5 }),
            createNodeWithSequence({ id: 6 }),
            createNodeWithoutSequence({ id: 7 }),
            createNodeWithoutSequence({ id: 8 }),
        ] as CustomNode[];

        links = [
            { source: 1, target: 2, value: 0 },
            { source: 2, target: 3, value: 0 },
            { source: 4, target: 5, value: 1 },
            { source: 1, target: 4, value: 2 }, // Above threshold
            { source: 1, target: 6, value: 3 }, // Above threshold and not connected to any other node
        ] as CustomLink[];
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should initializes the constructor correctly", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        expect(analyser).toBeDefined();
    });

    it("should assign correct cluster names to nodes", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const nodesWithClusters = analyser.assignClusterNamesToNodes();

        vi.mock("i18next", () => ({
            default: {
                t: vi.fn((key: string) => key),
            },
        }));

        expect(nodesWithClusters).toHaveLength(8);
        expect(nodesWithClusters[0].cluster).toBe("Cluster 1");
        expect(nodesWithClusters[1].cluster).toBe("Cluster 1");
        expect(nodesWithClusters[2].cluster).toBe("Cluster 1");
        expect(nodesWithClusters[3].cluster).toBe("Cluster 2");
        expect(nodesWithClusters[4].cluster).toBe("Cluster 2");
        expect(nodesWithClusters[5].cluster).toBe(i18next.t("clusterTypes.noClusterAssigned"));
        expect(nodesWithClusters[6].cluster).toBe(i18next.t("clusterTypes.noClusterAssigned"));
        expect(nodesWithClusters[7].cluster).toBe(i18next.t("clusterTypes.noClusterAssigned"));
    });

    it("should return correct clusters", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(2);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[1]).toHaveLength(2);
        expect(clusters[0].map((node) => node?.id)).toEqual([1, 2, 3]);
        expect(clusters[1].map((node) => node?.id)).toEqual([4, 5]);
    });

    it('should assign "keinem Ausbruch zugewiesen" to nodes which are not assigned to any cluster ', () => {
        const isolatedNode = { id: 9 } as CustomNode;
        nodes.push(isolatedNode);

        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const nodesWithClusters = analyser.assignClusterNamesToNodes();

        const isolatedNodeResult = nodesWithClusters.find((node) => node.id === 9);
        expect(isolatedNodeResult?.cluster).toBe("clusterTypes.noClusterAssigned");
    });

    it("should respect the minimum cluster size of nodes", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 3);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(1);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[0].map((node) => node?.id)).toEqual([1, 2, 3]);
    });

    it("should respect the clustering threshold", () => {
        const analyser = new ClusterAnalyser(nodes, links, 0, 2);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(1);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[0].map((node) => node?.id)).toEqual([1, 2, 3]);
    });

    it("should ignore contact links with a CONTACT_LINK_VALUE", () => {
        //connect node 1 with node 5 with a contact link (-1)
        links.push({ source: 1, target: 5, value: CONTACT_LINK_VALUE } as CustomLink);
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(2);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[1]).toHaveLength(2);
    });
});
