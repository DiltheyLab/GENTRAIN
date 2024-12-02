import { DataTable } from "@/modules/core/components/tables/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/core/components/ui/Select";
import { useGetAllCasesForActivePathogenWithRelationships } from "@/modules/core/hooks/database/cases/useGetAllCasesForActivePathogenWithRelationships";
import { caseAssignmentTableColumns } from "./caseAssignmentTableColumns";
import { useGetOutbreaksForActivePathogen } from "@/modules/core/hooks/database/outbreaks/useGetOutbreaksForActivePathogen";
import { t } from "i18next";
import { useState } from "react";
import { CaseWithRelationships } from "@/modules/core/models/cases";
import { caseAssignmentTableFilter } from "./caseAssignmentTableFilter";

export const CaseAssignment = () => {
    const noOutbreakAssignedId = "0";
    const cases = useGetAllCasesForActivePathogenWithRelationships();
    const outbreaks = useGetOutbreaksForActivePathogen();
    const noOutbreakIsAssigned = cases?.some((caseData) => !caseData.outbreak);
    const [casesInTable1, setCasesInTable1] = useState<CaseWithRelationships[]>([]);
    const [casesInTable2, setCasesInTable2] = useState<CaseWithRelationships[]>([]);

    const changeCasesInTable = (outbreakId: string, setCasesInTable: (cases: CaseWithRelationships[]) => void) => {
        if (!cases) return;
        let casesFilteredByOutbreak: CaseWithRelationships[] = [];
        if (outbreakId === noOutbreakAssignedId) {
            casesFilteredByOutbreak = cases.filter((caseData) => !caseData.outbreak_id);
        } else {
            casesFilteredByOutbreak = cases.filter((caseData) => caseData.outbreak_id?.toString() === outbreakId);
        }

        setCasesInTable(casesFilteredByOutbreak);
    };

    return (
        <div className="flex space-x-3 w-full max-h-[calc(100vh-270px)] h-[calc(100vh-270px)]">
            <div className="flex flex-col w-1/2">
                <Select onValueChange={(outbreakId) => changeCasesInTable(outbreakId, setCasesInTable1)}>
                    <SelectTrigger className="mb-7">
                        <SelectValue placeholder="Ausbruch auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                        {outbreaks?.map((outbreak) => (
                            <SelectItem value={outbreak.id.toString()}>{outbreak.name}</SelectItem>
                        ))}
                        {noOutbreakIsAssigned && (
                            <SelectItem value={noOutbreakAssignedId}>{t("clusterTypes.noOutbreakAssigned")}</SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <div className="overflow-auto flex-1">
                    <DataTable
                        data={casesInTable1 ?? []}
                        columns={caseAssignmentTableColumns}
                        filterFn={caseAssignmentTableFilter}
                        selectionLabel="Fällen"
                        pageSize={5}
                        filterPlaceholder="Fälle durchsuchen"
                    />
                </div>
            </div>
            <div className="flex flex-col w-1/2">
                <Select onValueChange={(outbreakId) => changeCasesInTable(outbreakId, setCasesInTable2)}>
                    <SelectTrigger className="mb-7">
                        <SelectValue placeholder="Ausbruch auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                        {outbreaks?.map((outbreak) => (
                            <SelectItem value={outbreak.id.toString()}>{outbreak.name}</SelectItem>
                        ))}
                        {noOutbreakIsAssigned && (
                            <SelectItem value={noOutbreakAssignedId}>{t("clusterTypes.noOutbreakAssigned")}</SelectItem>
                        )}
                    </SelectContent>
                </Select>
                <div className="overflow-auto flex-1">
                    <DataTable
                        data={casesInTable2 ?? []}
                        columns={caseAssignmentTableColumns}
                        filterFn={caseAssignmentTableFilter}
                        selectionLabel="Fällen"
                        pageSize={5}
                        filterPlaceholder="Fälle durchsuchen"
                    />
                </div>
            </div>
        </div>
    );
};
