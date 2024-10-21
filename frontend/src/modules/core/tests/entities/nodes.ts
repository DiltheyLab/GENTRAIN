import { CaseWithRelationships } from "../../models/cases";
import { CustomNode } from "../../types/graph";
import { createCase } from "./cases";
import { createSample } from "./samples";

type CustomNodeTest = Partial<CustomNode>;

export const createNodeWithSample = ({ id }: CustomNodeTest) => {
    const caseDataWithSample = createCase({ id: id, sample: createSample({}) }) as CaseWithRelationships;
    return { id, caseData: caseDataWithSample } as CustomNode;
};

export const createNodeWithoutSample = ({ id }: CustomNodeTest) => {
    const caseDataWithSample = createCase({ id: id, sample: null }) as CaseWithRelationships;
    return { id, caseData: caseDataWithSample } as CustomNode;
};
