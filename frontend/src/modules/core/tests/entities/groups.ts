import { GroupSchema } from "../../models/groups";

type TestGroup = {
    id?: number;
    name?: string;
    category_id?: number;
    pathogen_id?: number;
    case_count?: number | null;
    sequenced_case_count?: number | null;
    created_at?: Date;
    updated_at?: Date;
};

export const createGroup = ({
    id = 0,
    name = ":group_name:",
    category_id = 0,
    pathogen_id = 0,
    case_count = null,
    sequenced_case_count = null,
    created_at = new Date(),
    updated_at = new Date(),
}: TestGroup) => {
    return {
        id: id,
        name: name,
        category_id: category_id,
        pathogen_id: pathogen_id,
        case_count: case_count,
        sequenced_case_count: sequenced_case_count,
        created_at: created_at,
        updated_at: updated_at,
    } as GroupSchema;
};

export const createGroups = (amount: number = 2, category_id: number = 0, pathogen_id: number = 0) => {
    const groups = [];
    const date = new Date();
    for (let i = 0; i < amount; i++) {
        groups.push({
            id: i,
            name: `:group_name_${i}:`,
            category_id: category_id,
            pathogen_id: pathogen_id,
            created_at: date,
            updated_at: date,
        });
    }
    return groups;
};
