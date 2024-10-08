import { formatDate } from "@/modules/core/helpers/dates";
import { AnalysisSchema } from "@/modules/core/models/analyses";

const nameContainsValue = (analysis: AnalysisSchema, value: string) => {
    return analysis.name.toLowerCase().includes(value);
};

const outbreakNameContainsValue = (analysis: AnalysisSchema, value: string) => {
    return analysis.analysisSettings.selectedOutbreak?.name.toLowerCase().includes(value) ?? false;
};

const createdAtContainsValue = (analysis: AnalysisSchema, value: string) => {
    if (!analysis.created_at) {
        return false;
    }
    return formatDate(analysis.created_at).toLowerCase().includes(value);
};

export const analysesTableFilter = (row: any, _columnId: any, value: string, _addMeta: any) => {
    value = value.toLowerCase();
    return (
        nameContainsValue(row.original, value) ||
        outbreakNameContainsValue(row.original, value) ||
        createdAtContainsValue(row.original, value)
    );
};
