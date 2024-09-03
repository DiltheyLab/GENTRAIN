import { CaseWithRelationships } from "../models/cases";

export const createCasesMap = (cases: CaseWithRelationships[]) => {
    const casesMap = new Map<number, CaseWithRelationships>();
    for (const caseData of cases) {
        casesMap.set(caseData.id, caseData);
    }
    return casesMap;
};
