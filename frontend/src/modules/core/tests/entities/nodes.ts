import { CustomNode } from "../../types/graph";
import { createCase } from "./cases";
import { createSequenceAnalysis } from "./sequence_analysis";

export const createNodeWithSequence = ({ id }: Partial<CustomNode>) => {
    const caseDataWithSequence = createCase({
        id: id,
        sequence_analysis: createSequenceAnalysis({}),
    });
    return { id, caseData: caseDataWithSequence } as CustomNode;
};

export const createNodeWithoutSequence = ({ id }: Partial<CustomNode>) => {
    const caseDataWithoutSequence = createCase({ id: id, sequence_analysis: null });
    return { id, caseData: caseDataWithoutSequence } as CustomNode;
};
