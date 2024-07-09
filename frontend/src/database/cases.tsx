export interface CaseSchema {
    id: string;
    fasta_id: string;
    pathogen_id: number;
    date: string;
    groups: Array<string>;
    updated_at: string;
}
