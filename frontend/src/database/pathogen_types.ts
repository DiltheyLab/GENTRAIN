export enum PathogenTypeName {
    bacteria,
    virus,
}

export interface PathogenTypeSchema {
    id: number;
    name: PathogenTypeName;
    updated_at: Date;
}
