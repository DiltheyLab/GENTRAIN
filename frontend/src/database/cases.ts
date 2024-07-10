export interface CaseSchema {
    id: number;
    case_id: string;
    sample_id: string;
    pathogen_id: number;
    date: string;
    groups: Array<string>;
    updated_at: string;
}
