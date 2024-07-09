export interface DistancesSchema {
    id: number;
    sample_fasta_id_1: string;
    sample_fasta_id_2: string;
    distance_matrix_id: number;
    value: number;
    updated_at: string;
}
