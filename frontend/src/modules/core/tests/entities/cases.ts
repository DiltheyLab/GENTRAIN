import { CaseWithRelationships } from "../../models/cases";

export const createCase = (overrides: Partial<CaseWithRelationships>) => {
    return {
        id: 0,
        case_id: ":case_id:",
        fasta_id: ":fasta_id:",
        city: ":city:",
        street: ":street:",
        first_name: ":first_name:",
        last_name: ":last_name:",
        zip_code: ":zip_code:",
        sequence_analysis: null,
        infected_by: ":infected_by:",
        pathogen_id: 0,
        outbreak_id: null,
        group_ids: [],
        registered_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        pathogen: null,
        outbreak: null,
        groups: [],
        contacts: null,
        ...overrides,
    } as CaseWithRelationships;
};
