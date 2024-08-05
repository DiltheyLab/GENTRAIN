import { getAllDistancesForDistanceMatrixWithFastaIds } from "@/database/distances";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";

export const assembleDistanceMatrix = async (distanceMatrixId: number) => {
    const distances = await getAllDistancesForDistanceMatrixWithFastaIds(distanceMatrixId);
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
