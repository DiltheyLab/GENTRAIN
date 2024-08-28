import { type Link } from "@/modules/core/types/graph";
import { CaseWithRelationships } from "../../models/cases";
import { DistanceMatrixAssembly } from "../../models/distance_matrices";

export class Kruskal {
    private numberOfNodes: number;
    private links: Link[];
    private graphCases: CaseWithRelationships[];
    private matrixDataAssembly: DistanceMatrixAssembly;

    constructor(graphCases: CaseWithRelationships[], matrixDataAssembly: DistanceMatrixAssembly) {
        this.graphCases = graphCases;
        this.matrixDataAssembly = matrixDataAssembly;
        this.numberOfNodes = graphCases.length;
        this.links = [];
    }

    public getMSTLinks = () => {
        this.collectLinks();
        return this.filterLinks();
    };

    // calculate links that are in the mst by using kruskal's algorithm
    private filterLinks = () => {
        this.links.sort((a, b) => a.weight - b.weight); // Sort links by weight

        const parent = Array(this.numberOfNodes)
            .fill(0)
            .map((_, i) => i); // Disjoint-set 'parent' array

        // Find the root of the set to which element i belongs
        const find = (i: number) => {
            while (i !== parent[i]) {
                i = parent[i];
            }
            return i;
        };

        // Union of two sets
        const union = (i: number, j: number) => {
            const rootI = find(i);
            const rootJ = find(j);
            parent[rootI] = rootJ;
        };

        const mst: Link[] = []; // Array to store the links of the minimum spanning tree
        this.links.forEach((link) => {
            if (find(link.source) !== find(link.target)) {
                // If adding this link doesn't form a cycle
                union(link.source, link.target);
                mst.push(link);
            }
        });

        return mst;
    };

    private collectLinks = () => {
        // the column loop starts with rowIndex + 1 to prevent looping over cases which are already treated
        // because of that rowIndex is stopping with graphCases.length - 1
        for (let rowIndex = 0; rowIndex < this.graphCases.length - 1; rowIndex++) {
            const rowCase = this.graphCases[rowIndex];

            for (let columnIndex = rowIndex + 1; columnIndex < this.graphCases.length; columnIndex++) {
                const columnCase = this.graphCases[columnIndex];

                if (!rowCase.sample || !columnCase.sample) continue;
                this.links.push({
                    source: rowIndex,
                    target: columnIndex,
                    weight: this.matrixDataAssembly[rowCase.sample.fasta_id][columnCase.sample.fasta_id],
                } satisfies Link);
            }
        }
    };
}
