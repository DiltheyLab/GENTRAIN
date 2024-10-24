import { GroupWithRelationships } from "../../models/groups";

type TestGroup = Partial<GroupWithRelationships>;

export const createGroup = ({
    id = 0,
    name = ":group_name:",
    category_id = 0,
    category = null,
    pathogen_id = 0,
    pathogen = null,
    case_count = null,
    sequenced_case_count = null,
    created_at = new Date(),
    updated_at = new Date(),
}: TestGroup = {}) => {
    return {
        id: id,
        name: name,
        category_id: category_id,
        category: category,
        pathogen_id: pathogen_id,
        pathogen: pathogen,
        case_count: case_count,
        sequenced_case_count: sequenced_case_count,
        created_at: created_at,
        updated_at: updated_at,
    } as GroupWithRelationships;
};

export const createGroups = (
    {
        category_id = 0,
        pathogen_id = 0,
    }: {
        category_id?: number;
        pathogen_id?: number;
    } = {},
    amount = 2
) => {
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
