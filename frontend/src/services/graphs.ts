import { DistanceMatrixSchema } from "@/database/distance_matrix";
import { SampleSchema } from "@/database/samples";
import { CustomLink, CustomNode } from "@/providers/GraphSettingsProvider";
import { Edge, KruskalMST, WeightedGraph } from "js-graph-algorithms";
import { GraphData } from "@/providers/GraphSettingsProvider";

type ColoringMode = "goldenAngleApprox" | "gradient";

export const setNodeColor = (value: number, variant: ColoringMode) => {
    if (variant === "goldenAngleApprox") {
        const hue = value * 137.508; // use golden angle approximation
        return `hsl(${hue},50%,75%)`;
    } else if (variant === "gradient") {
        //create gradient from blue to red
        const r = Math.floor((255 * value) / 100);
        const g = Math.floor((255 * (100 - value)) / 100);
        const b = 0;
        return `rgb(${r},${g},${b})`;
    }
};

type ColorGroup = "group" | "sampled_at";

export const getGroupToColor = (samples: SampleSchema[], colorGroup: ColorGroup) => {
    // Extract unique groups and assign colors
    const groups = samples.map((sample) => sample[colorGroup]);
    const uniqueGroups = [...new Set(groups)];
    const groupToColor: Record<string, string> = {};
    uniqueGroups.forEach((group, index) => {
        groupToColor[group] = setNodeColor(index, "goldenAngleApprox") || "black";
    });
    return groupToColor;
};

// Helper function to transform matrix data to graph data
export const transformMatrixToGraphData = (matrixData: DistanceMatrixSchema, samples: SampleSchema[]): GraphData => {
    let graph = new WeightedGraph(matrixData.matrix.length);

    // for the top part of the dm (as it is mirrored and the diagonal is all -1)
    for (let row = 0; row < matrixData.row_column_names.length - 1; row++) {
        for (let column = row + 1; column < matrixData.row_column_names.length; column++) {
            // add an edge for every distance
            graph.addEdge(new Edge(row, column, matrixData.matrix[row][column]));
        }
    }

    // calculate edges that are in the mst
    const kruskal = new KruskalMST(graph);
    const mst_edges = kruskal.mst;

    const groupToColor = getGroupToColor(samples, "group");

    // create node objects
    const nodes = matrixData.row_column_names.map((name) => {
        const sampleMetaData = samples.find((sample) => name === sample.fasta_id);
        const group = sampleMetaData?.group || "No Group";
        return {
            id: name,
            group: group,
            color: groupToColor[group],
        } satisfies CustomNode;
    }) as CustomNode[];

    const links = mst_edges.map((edge) => {
        return { source: nodes[edge["v"]].id, target: nodes[edge["w"]].id, value: edge["weight"], type: "Solid" };
    }) as CustomLink[];

    return {
        nodes: nodes,
        links: links,
    };
};
