import { CustomNode } from "../types/graph";

export const createNodeMap = (nodes: CustomNode[]) => {
    const nodesWithSamples = nodes.filter((node) => node.caseData.sample);

    const nodeMap = new Map<number, CustomNode>();
    for (const node of nodesWithSamples) {
        nodeMap.set(node.id, node);
    }
    return nodeMap;
};
