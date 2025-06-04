import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";
import { SequenceImport } from "@/modules/core/models/sequence_analyses";

export type CaseImports = {
    [id: string]: {
        imported: CaseImport;
        persisted: CaseWithRelationships | null;
        import: boolean;
    };
};

export type SequenceImports = {
    [sequenceHash: string]: SequenceImport;
};
