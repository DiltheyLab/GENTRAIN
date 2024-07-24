class Edge {
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
    numberOfEdges: number;
    edges: Edge[];

    constructor(size: number) {
        this.numberOfNodes = size;
        this.numberOfEdges = 0;
        this.edges = [];
    }

    addEdge(edge: Edge): void {
        this.edges.push(edge);
        this.numberOfEdges++;
    }

    // Kruskal's algorithm to find the minimum spanning tree
    kruskal() {
        this.edges.sort((a, b) => a.weight - b.weight); // Sort edges by weight

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

        const mst: Edge[] = []; // Array to store the edges of the minimum spanning tree
        this.edges.forEach((edge) => {
            if (find(edge.source) !== find(edge.target)) {
                // If adding this edge doesn't form a cycle
                union(edge.source, edge.target);
                mst.push(edge);
            }
        });

        return mst;
    }
}

export { Edge, Graph };
