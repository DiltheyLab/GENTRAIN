import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";

export type CaseImports = {
    [id: string]: {
        imported: CaseImport;
        persisted: CaseWithRelationships | null;
        import: boolean;
    };
};
