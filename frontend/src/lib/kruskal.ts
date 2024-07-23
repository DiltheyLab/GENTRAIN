class Edge {
    v: number;
    w: number;
    weight: number;

    constructor(v: number, w: number, weight: number) {
        this.v = v;
        this.w = w;
        this.weight = weight;
    }
}

class Graph {
    v: number; // Number of vertices
    e: number; // Number of edges
    edges: Edge[];
    nodes: number[];

    constructor(size: number) {
        this.v = size; // Number of vertices
        this.e = 0; // Initialize with 0 edges
        this.edges = [];
        this.nodes = [];

        // Initialize nodes based on the size
        for (let i = 0; i < size; i++) {
            this.nodes.push(i); // Assuming node values are integers starting from 0
        }
    }

    addEdge(edge: Edge): void {
        this.edges.push(edge);
        this.e++;
        // No need to update nodes here if they are initialized in the constructor
    }
    // Kruskal's algorithm to find the minimum spanning tree
    kruskal() {
        this.edges.sort((a, b) => a.weight - b.weight); // Sort edges by weight

        const parent = Array(this.v)
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
            if (find(edge.v) !== find(edge.w)) {
                // If adding this edge doesn't form a cycle
                union(edge.v, edge.w); // Union the sets
                mst.push(edge); // Add edge to MST
            }
        });

        return mst;
    }
}

export { Edge, Graph };
