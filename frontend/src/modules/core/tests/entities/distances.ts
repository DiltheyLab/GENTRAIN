import { DistancesSchema } from "../../models/distances";

export const createDistance = ({
    id = 1,
    case_id_1,
    case_id_2,
    value = 0,
    distance_matrix_id = 1,
    created_at = new Date(),
    updated_at = new Date(),
}: Partial<DistancesSchema>) => {
    return {
        id,
        case_id_1,
        case_id_2,
        value,
        distance_matrix_id,
        created_at,
        updated_at,
    } as DistancesSchema;
};
