import { CaseWithRelationships } from "@/modules/core/models/cases";
import { useEffect, useState } from "react";

export const useCopyCases = (cases: CaseWithRelationships[] | undefined) => {
    const [casesCopy, setCasesCopy] = useState(cases);

    // create copy of cases when they are loaded
    useEffect(() => {
        if (cases) {
            setCasesCopy(structuredClone(cases));
        }
    }, [cases]);

    return casesCopy;
};
