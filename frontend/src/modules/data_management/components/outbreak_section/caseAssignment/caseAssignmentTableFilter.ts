import { formatDate } from "@/modules/core/helpers/dates";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { Row } from "@tanstack/react-table";

const caseIdContainsValue = (caseId: string, value: string) => {
    return caseId.toLowerCase().includes(value);
};

const registeredAtContainsValue = (registeredAt: Date, value: string) => {
    return formatDate(registeredAt).toLowerCase().includes(value);
};

export const caseAssignmentTableFilter = (
    row: Row<CaseWithRelationships>,
    _columnId: any,
    value: string,
    _addMeta: any
) => {
    value = value.toLowerCase();

    return (
        caseIdContainsValue(row.original.case_id, value) || registeredAtContainsValue(row.original.registered_at, value)
    );
};
