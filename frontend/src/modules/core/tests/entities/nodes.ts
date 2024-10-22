import { CaseWithRelationships } from "../../models/cases";
import { CustomNode } from "../../types/graph";
import { createCase } from "./cases";
import { createSample } from "./samples";

type TestCustomNode = Partial<CustomNode>;

export const createNodeWithSample = ({ id }: TestCustomNode) => {
    const caseDataWithSample = createCase({ id: id, sample: createSample({}) }) as CaseWithRelationships;
    return { id, caseData: caseDataWithSample } as CustomNode;
};

export const createNodeWithoutSample = ({ id }: TestCustomNode) => {
    const caseDataWithSample = createCase({ id: id, sample: null }) as CaseWithRelationships;
    return { id, caseData: caseDataWithSample } as CustomNode;
};
