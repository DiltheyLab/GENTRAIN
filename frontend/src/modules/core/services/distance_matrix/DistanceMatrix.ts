import { DistanceMatrixAssembly } from "../../models/distance_matrices";
import { getAllDistancesForDistanceMatrixWithFastaIds } from "../../models/distances";

export class DistanceMatrix {
    private id: number;
    constructor(id: number) {
        this.id = id;
    }
    public assemble = async () => {
        const distances = await getAllDistancesForDistanceMatrixWithFastaIds(this.id);
        if (!distances) return;
        const matrix: DistanceMatrixAssembly = {};
        for (const distance of distances) {
            if (!matrix[distance.fasta_id_1]) {
                matrix[distance.fasta_id_1] = {};
            }
            matrix[distance.fasta_id_1][distance.fasta_id_2] = distance.value;
            if (!matrix[distance.fasta_id_2]) {
                matrix[distance.fasta_id_2] = {};
            }
            matrix[distance.fasta_id_2][distance.fasta_id_1] = distance.value;
        }
        return matrix;
    };
}
