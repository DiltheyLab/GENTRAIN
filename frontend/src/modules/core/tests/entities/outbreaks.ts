import { OutbreakSchema } from "../../models/outbreaks";

type TestOutbreak = Partial<OutbreakSchema>;

export const createOutbreak = ({
    id = 0,
    name = ":outbreak_name:",
    pathogen_id = 0,
    case_count = null,
    sequenced_case_count = null,
    created_at = new Date(),
    updated_at = new Date(),
}: TestOutbreak) => {
    return {
        id: id,
        name: name,
        pathogen_id: pathogen_id,
        case_count: case_count,
        sequenced_case_count: sequenced_case_count,
        created_at: created_at,
        updated_at: updated_at,
    } as OutbreakSchema;
};
