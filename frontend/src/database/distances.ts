export interface DistancesSchema {
    id: number;
    sample_id_1: number;
    sample_id_2: number;
    distance_matrix_id: number;
    value: number;
    created_at?: Date;
    updated_at?: Date;
}
