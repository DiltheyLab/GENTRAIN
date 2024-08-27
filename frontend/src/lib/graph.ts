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
    private numberOfNodes: number;
    private numberOfLinks: number;
    private links: Link[];
    private adjacencyList: { [key: number]: number[] };

    constructor(size: number, nodes?: number[], links?: Link[]) {
        this.numberOfNodes = size;
        this.numberOfLinks = 0;
        this.links = [];
        this.adjacencyList = {};
        nodes?.forEach((node) => {
            this.addNodeToAdjacencyList(node);
        });
        links?.forEach((link) => this.addLinkToAdjacencyList(link.source, link.target));
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

    addNodeToAdjacencyList(node: number): void {
        if (!this.adjacencyList[node]) {
            this.adjacencyList[node] = [];
        }
    }

    addLinkToAdjacencyList(node1: number, node2: number): void {
        this.adjacencyList[node1].push(node2);
        this.adjacencyList[node2].push(node1);
    }

    getConnectedComponents(): number[][] {
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

        for (let node in this.adjacencyList) {
            if (!visited.has(Number(node))) {
                const component: number[] = [];
                dfs(Number(node), component);
                components.push(component);
            }
        }

        return components;
    }
}

export { Link, Graph };
