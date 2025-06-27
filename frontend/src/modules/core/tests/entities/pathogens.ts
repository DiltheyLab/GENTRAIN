import { PathogenSchema } from "../../models/pathogens";

export const createPathogen = (overrides: Partial<PathogenSchema>) => {
    return {
        id: 0,
        name: ":name:",
        genetic_distance_threshold: 0,
        pathogen_type_id: 0,
        cases_example: null,
        sequences_example: null,
        contacts_example: null,
        activated_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        ...overrides,
    } as PathogenSchema;
};
