export enum PathogenTypeName {
    bacteria,
    virus,
}

export interface PathogenTypeSchema {
    id: number;
    name: PathogenTypeName;
    created_at?: Date;
    updated_at?: Date;
}
