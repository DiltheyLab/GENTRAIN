import { describe, test, expect, beforeEach, vi } from "vitest";
import { CustomNode, CustomLink } from "@/modules/core/types/graph";
import { ClusterAnalyser } from "../../services/graph/ClusterAnalyser";
import { createNodeWithoutSample, createNodeWithSample } from "../entities/nodes";
import i18next from "i18next";
import { CONTACT_LINK_VALUE } from "../../services/graph/GraphDataGenerator";

// Mock i18next
vi.mock("i18next", () => ({
    default: {
        t: vi.fn((key) => key),
    },
}));

describe("ClusterAnalyser", () => {
    let nodes: CustomNode[];
    let links: CustomLink[];

    beforeEach(() => {
        nodes = [
            createNodeWithSample({ id: 1 }),
            createNodeWithSample({ id: 2 }),
            createNodeWithSample({ id: 3 }),
            createNodeWithSample({ id: 4 }),
            createNodeWithSample({ id: 5 }),
            createNodeWithSample({ id: 6 }),
            createNodeWithoutSample({ id: 7 }),
            createNodeWithoutSample({ id: 8 }),
        ] as CustomNode[];

        links = [
            { source: 1, target: 2, value: 0 },
            { source: 2, target: 3, value: 0 },
            { source: 4, target: 5, value: 1 },
            { source: 1, target: 4, value: 2 }, // Above threshold
            { source: 1, target: 6, value: 3 }, // Above threshold and not connected to any other node
        ] as CustomLink[];
    });

    test("constructor initializes correctly", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        expect(analyser).toBeDefined();
    });

    test("assignClusterNamesToNodes assigns correct cluster names", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const nodesWithClusters = analyser.assignClusterNamesToNodes();

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

    test("getClusters returns correct clusters", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(2);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[1]).toHaveLength(2);
        expect(clusters[0].map((node) => node?.id)).toEqual([1, 2, 3]);
        expect(clusters[1].map((node) => node?.id)).toEqual([4, 5]);
    });

    test('nodes not in any cluster are assigned "noClusterAssigned"', () => {
        const isolatedNode = { id: 9 } as CustomNode;
        nodes.push(isolatedNode);

        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const nodesWithClusters = analyser.assignClusterNamesToNodes();

        const isolatedNodeResult = nodesWithClusters.find((node) => node.id === 9);
        expect(isolatedNodeResult?.cluster).toBe("clusterTypes.noClusterAssigned");
    });

    test("respects minClusterSize", () => {
        const analyser = new ClusterAnalyser(nodes, links, 1, 3);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(1);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[0].map((node) => node?.id)).toEqual([1, 2, 3]);
    });

    test("respects clusteringThreshold", () => {
        const analyser = new ClusterAnalyser(nodes, links, 0, 2);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(1);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[0].map((node) => node?.id)).toEqual([1, 2, 3]);
    });

    test("ignores CONTACT_LINK_VALUE links", () => {
        //connect node 1 with node 5 with a contact link (-1)
        links.push({ source: 1, target: 5, value: CONTACT_LINK_VALUE } as CustomLink);
        const analyser = new ClusterAnalyser(nodes, links, 1, 2);
        const clusters = analyser.getClusters();

        expect(clusters).toHaveLength(2);
        expect(clusters[0]).toHaveLength(3);
        expect(clusters[1]).toHaveLength(2);
    });
});
