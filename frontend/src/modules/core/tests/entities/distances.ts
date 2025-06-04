type TestDistance = {
    id?: number;
    case_id_1: number;
    case_id_2: number;
    value?: number;
    distance_matrix_id?: number;
    created_at?: Date;
    updated_at?: Date;
};

export const createDistance = ({
    id = 1,
    case_id_1,
    case_id_2,
    value = 0,
    distance_matrix_id = 1,
    created_at = new Date(),
    updated_at = new Date(),
}: TestDistance) => {
    return {
        id,
        case_id_1,
        case_id_2,
        value,
        distance_matrix_id,
        created_at,
        updated_at,
    };
};
