import { CaseWithRelationships } from "@/database/cases";

const caseIdContainsValue = (caseData: CaseWithRelationships, value: string) => {
    return caseData.case_id.toLowerCase().includes(value);
};

const fastaIdContainsValue = (caseData: CaseWithRelationships, value: string) => {
    return caseData.fasta_id?.toLowerCase().includes(value);
};

const lineageContainsValue = (caseData: CaseWithRelationships, value: string) => {
    return caseData.sample?.lineage?.toLowerCase().includes(value);
};

const categoryNameContainsValue = (caseData: CaseWithRelationships, value: string) => {
    if (caseData.groups) {
        for (const group of caseData.groups) {
            if (group.category?.name.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    return false;
};

const groupNameContainsValue = (caseData: CaseWithRelationships, value: string) => {
    if (caseData.groups) {
        for (const group of caseData.groups) {
            if (group.name.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    return false;
};

const outbreakNameContainsValue = (caseData: CaseWithRelationships, value: string) => {
    if (value === "background") {
        return !caseData.outbreak;
    }
    if (caseData.outbreak) {
        return caseData.outbreak.name.toLowerCase().includes(value);
    }
};

export const customFilterFn = (row: any, _columnId: any, value: string, _addMeta: any) => {
    value = value.toLowerCase();
    return (
        caseIdContainsValue(row.original, value) ||
        fastaIdContainsValue(row.original, value) ||
        lineageContainsValue(row.original, value) ||
        outbreakNameContainsValue(row.original, value) ||
        groupNameContainsValue(row.original, value) ||
        categoryNameContainsValue(row.original, value)
    );
};
