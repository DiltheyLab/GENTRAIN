type TestDistance = {
    id?: number;
    sample_id_1: number;
    sample_id_2: number;
    value?: number;
    distance_matrix_id?: number;
    created_at?: Date;
    updated_at?: Date;
};

export const createDistance = ({
    id = 1,
    sample_id_1,
    sample_id_2,
    value = 0,
    distance_matrix_id = 1,
    created_at = new Date(),
    updated_at = new Date(),
}: TestDistance) => {
    return {
        id,
        sample_id_1,
        sample_id_2,
        value,
        distance_matrix_id,
        created_at,
        updated_at,
    };
};
