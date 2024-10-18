import { beforeEach, describe, expect, it } from "vitest";
import { CustomNode, CustomLink } from "@/modules/core/types/graph";
import { Kruskal } from "../../services/graph/Kruskal";

describe("Kruskal", () => {
    let nodes: CustomNode[];
    let links: CustomLink[];

    beforeEach(() => {
        nodes = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }] as CustomNode[];

        links = [
            { source: 0, target: 1, value: 10 },
            { source: 0, target: 2, value: 6 },
            { source: 0, target: 3, value: 5 },
            { source: 1, target: 3, value: 15 },
            { source: 2, target: 3, value: 4 },
        ] as CustomLink[];
    });

    it("should initialize properties correctly in the constructor", () => {
        const kruskal = new Kruskal(nodes, links);
        expect(kruskal.nodes).toBe(nodes);
        expect(kruskal.links).toBe(links);
        expect(kruskal.numberOfNodes).toBe(4);
    });

    it("should return correct minimum spanning tree", () => {
        const kruskal = new Kruskal(nodes, links);
        const mstLinks = kruskal.getMSTLinks();

        expect(mstLinks).toHaveLength(3);
        expect(mstLinks).toContainEqual({ source: 0, target: 1, value: 10 });
        expect(mstLinks).toContainEqual({ source: 0, target: 3, value: 5 });
        expect(mstLinks).toContainEqual({ source: 2, target: 3, value: 4 });
    });

    it("should handle disconnected graph", () => {
        const disconnectedNodes = [...nodes, { id: 4 }] as CustomNode[];
        const kruskal = new Kruskal(disconnectedNodes, links);
        const mstLinks = kruskal.getMSTLinks();

        expect(mstLinks).toHaveLength(3);
    });

    it("should handle empty graph", () => {
        const kruskal = new Kruskal([], []);
        const mstLinks = kruskal.getMSTLinks();

        expect(mstLinks).toHaveLength(0);
    });

    it("should handle graph with single node", () => {
        const singleNode = [{ id: 0 }] as CustomNode[];
        const kruskal = new Kruskal(singleNode, []);
        const mstLinks = kruskal.getMSTLinks();

        expect(mstLinks).toHaveLength(0);
    });
});
