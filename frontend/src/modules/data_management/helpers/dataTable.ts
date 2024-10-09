import { CaseImport, CaseWithRelationships } from "@/modules/core/models/cases";
import { ContactImport } from "@/modules/core/models/contacts";

export const uploadedDataFilterFn = (row: any, _columnId: any, value: string, _addMeta: any) => {
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

export const caseImportFilterFn = (row: any, _columnId: any, value: string, _addMeta: any) => {
    value = value.toLowerCase();
    return (
        caseIdContainsValue(row.original, value) ||
        fastaIdContainsValue(row.original, value) ||
        outbreakNameContainsValue(row.original, value) ||
        groupNameContainsValue(row.original, value) ||
        categoryNameContainsValue(row.original, value)
    );
};

export const caseUpdateFilterFn = (row: any, _columnId: any, value: string, _addMeta: any) => {
    value = value.toLowerCase();
    return (
        caseIdContainsValue(row.original, value) ||
        existingAndImportedFastaIdContainsValue(row.original, value) ||
        existingAndImportedOutbreakNameContainsValue(row.original, value) ||
        existingAndImportedCategoryNameContainsValue(row.original, value) ||
        existingAndImportedGroupNameContainsValue(row.original, value)
    );
};

export const sampleImportFilterFn = (row: any, _columnId: any, value: string, _addMeta: any) => {
    value = value.toLowerCase();
    return caseIdContainsValue(row.original, value) || fastaIdContainsValue(row.original, value);
};

export const contactImportFilterFn = (row: any, _columnId: any, value: string, _addMeta: any) => {
    value = value.toLowerCase();
    return (
        contactCaseIdsContainValue(row.original, value) ||
        contactTypeContainsValue(row.original, value) ||
        contactContextContainsValue(row.original, value)
    );
};

const caseIdContainsValue = (data: CaseWithRelationships, value: string) => {
    return data.case_id.toLowerCase().includes(value);
};

const contactCaseIdsContainValue = (data: ContactImport, value: string) => {
    return data.case_id_1.toLowerCase().includes(value) || data.case_id_2.toLowerCase().includes(value);
};

const contactTypeContainsValue = (data: ContactImport, value: string) => {
    return data.type.toLowerCase().includes(value);
};

const contactContextContainsValue = (data: ContactImport, value: string) => {
    return data.context.toLowerCase().includes(value);
};

const fastaIdContainsValue = (data: CaseWithRelationships, value: string) => {
    if (!data.fasta_id) {
        return false;
    }
    return data.fasta_id?.toLowerCase().includes(value);
};

const existingAndImportedFastaIdContainsValue = (
    data: CaseImport & { existingCase: CaseWithRelationships },
    value: string
) => {
    if (data.fasta_id && data.fasta_id?.toLowerCase().includes(value)) {
        return true;
    }
    if (data.existingCase.fasta_id && data.existingCase.fasta_id?.toLowerCase().includes(value)) {
        return true;
    }
    return false;
};

const lineageContainsValue = (data: CaseWithRelationships, value: string) => {
    if (!data.sample?.lineage) {
        return false;
    }
    return data.sample?.lineage?.toLowerCase().includes(value);
};

const categoryNameContainsValue = (data: CaseWithRelationships | CaseImport, value: string) => {
    if (data.groups) {
        for (const group of data.groups) {
            if (group.category instanceof String && group.category.toLowerCase().includes(value)) {
                return true;
            } else if (group.category instanceof Object && group.category?.name.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    return false;
};

const existingAndImportedCategoryNameContainsValue = (
    data: CaseImport & { existingCase: CaseWithRelationships },
    value: string
) => {
    if (data.groups) {
        for (const group of data.groups) {
            if (group.category.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    if (data.existingCase.groups) {
        for (const group of data.existingCase.groups) {
            if (group.category?.name.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    return false;
};

const groupNameContainsValue = (data: CaseWithRelationships | CaseImport, value: string) => {
    if (data.groups) {
        for (const group of data.groups) {
            if (group.name.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    return false;
};

const existingAndImportedGroupNameContainsValue = (
    data: CaseImport & { existingCase: CaseWithRelationships },
    value: string
) => {
    if (data.groups) {
        for (const group of data.groups) {
            if (group.name.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    if (data.existingCase.groups) {
        for (const group of data.existingCase.groups) {
            if (group.name.toLowerCase().includes(value)) {
                return true;
            }
        }
    }
    return false;
};

const outbreakNameContainsValue = (data: CaseWithRelationships | CaseImport, value: string) => {
    if (data.outbreak) {
        if (data.outbreak instanceof Object && data.outbreak?.name.toLowerCase().includes(value)) {
            return true;
        } else if (data.outbreak.toString().toLowerCase().includes(value)) {
            return true;
        }
    }
    return false;
};

const existingAndImportedOutbreakNameContainsValue = (
    data: CaseImport & { existingCase: CaseWithRelationships },
    value: string
) => {
    if (data.outbreak && data.outbreak.toString().toLowerCase().includes(value)) {
        return true;
    }
    if (data.existingCase.outbreak && data.existingCase.outbreak?.name.toString().toLowerCase().includes(value)) {
        return true;
    }
    return false;
};
