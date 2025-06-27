import { DistanceMatrixAssembly } from "@/modules/core/models/distance_matrices";
import { getAllDistancesForDistanceMatrixWithCaseReferences } from "@/modules/core/models/distances";

export class DistanceMatrix {
    private id: number;
    constructor(id: number) {
        this.id = id;
    }
    public assemble = async () => {
        const distances = await getAllDistancesForDistanceMatrixWithCaseReferences(this.id);
        if (!distances) return;
        const matrix: DistanceMatrixAssembly = {};
        for (const distance of distances) {
            if (!matrix[distance.case_reference_1]) {
                matrix[distance.case_reference_1] = {};
            }
            matrix[distance.case_reference_1][distance.case_reference_2] = distance.value;
            if (!matrix[distance.case_reference_2]) {
                matrix[distance.case_reference_2] = {};
            }
            matrix[distance.case_reference_2][distance.case_reference_1] = distance.value;
        }
        return matrix;
    };
}
