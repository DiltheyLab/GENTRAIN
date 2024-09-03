import { CustomNode, GraphData } from "../types/graph";

export const createNodeMap = (graphData: GraphData) => {
    const nodesWithSamples = graphData.nodes.filter((node) => node.caseData.sample);

    const nodeMap = new Map<number, CustomNode>();
    for (const node of nodesWithSamples) {
        nodeMap.set(node.id, node);
    }
    return nodeMap;
};
