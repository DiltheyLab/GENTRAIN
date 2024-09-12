import { CustomLink, CustomNode } from "@/modules/core/types/graph";
export class Kruskal {
    nodes: CustomNode[];
    links: CustomLink[];
    numberOfNodes: number;

    constructor(nodes: CustomNode[], links: CustomLink[]) {
        this.nodes = nodes;
        this.links = links;
        this.numberOfNodes = nodes.length;
    }

    getMSTLinks(): CustomLink[] {
        const result: CustomLink[] = [];
        const parent = new Map<number, number>();
        const rank = new Map<number, number>();

        this.nodes.forEach((node) => {
            parent.set(node.id, node.id);
            rank.set(node.id, 0);
        });

        this.links.sort((a, b) => a.value - b.value);

        for (const link of this.links) {
            const x = this.find(parent, link.source);
            const y = this.find(parent, link.target);

            if (x !== y) {
                result.push(link);
                this.union(parent, rank, x, y);
            }
        }

        return result;
    }

    private find(parent: Map<number, number>, i: number): number {
        if (parent.get(i) !== i) {
            parent.set(i, this.find(parent, parent.get(i)!));
        }
        return parent.get(i)!;
    }

    private union(parent: Map<number, number>, rank: Map<number, number>, x: number, y: number): void {
        const rootX = this.find(parent, x);
        const rootY = this.find(parent, y);

        if (rank.get(rootX)! < rank.get(rootY)!) {
            parent.set(rootX, rootY);
        } else if (rank.get(rootX)! > rank.get(rootY)!) {
            parent.set(rootY, rootX);
        } else {
            parent.set(rootY, rootX);
            rank.set(rootX, rank.get(rootX)! + 1);
        }
    }
}
