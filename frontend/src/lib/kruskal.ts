class Link {
    source: number;
    target: number;
    weight: number;

    constructor(source: number, target: number, weight: number) {
        this.source = source;
        this.target = target;
        this.weight = weight;
    }
}

class Graph {
    numberOfNodes: number;
    numberOfLinks: number;
    links: Link[];

    constructor(size: number) {
        this.numberOfNodes = size;
        this.numberOfLinks = 0;
        this.links = [];
    }

    addLink(link: Link): void {
        this.links.push(link);
        this.numberOfLinks++;
    }

    // Kruskal's algorithm to find the minimum spanning tree
    kruskal() {
        this.links.sort((a, b) => a.weight - b.weight); // Sort links by weight

        const parent = Array(this.numberOfNodes)
            .fill(0)
            .map((_, i) => i); // Disjoint-set 'parent' array

        // Find the root of the set to which element i belongs
        function find(i: number) {
            while (i !== parent[i]) {
                i = parent[i];
            }
            return i;
        }

        // Union of two sets
        function union(i: number, j: number) {
            const rootI = find(i);
            const rootJ = find(j);
            parent[rootI] = rootJ;
        }

        const mst: Link[] = []; // Array to store the links of the minimum spanning tree
        this.links.forEach((link) => {
            if (find(link.source) !== find(link.target)) {
                // If adding this link doesn't form a cycle
                union(link.source, link.target);
                mst.push(link);
            }
        });

        return mst;
    }
}

export { Link, Graph };
