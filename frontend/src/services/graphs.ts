<<<<<<< Updated upstream
import { DistanceMatrixSchema } from "@/database/distance_matrix";
import { SampleSchema } from "@/database/samples";
=======
import { CaseSchema, CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
>>>>>>> Stashed changes
import { CustomLink, CustomNode, Filter, GraphData } from "@/stores/graph";
import { Edge, KruskalMST, WeightedGraph } from "js-graph-algorithms";
import { assembleDistanceMatrix } from "./distanceMatrices";

export const setNodeColor = (value: number) => {
    const hue = value * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
};

const setNodeGradientColor = (normalizedIndex: number): string => {
    // Interpolate hue from 240 (blue) to 0 (red)
    const hue = 70 - normalizedIndex * 70;
    // Use fixed saturation and lightness values
    return `hsl(${hue}, 100%, 50%)`;
};

type GroupToColor = {
    [key: string]: string;
};

export const getGroupToColor = (samples: SampleSchema[], sampleAttribute: keyof SampleSchema) => {
    // Extract unique groups and assign colors
    const uniqueGroups = getUniqueGroupsBySampleMetaData(samples, sampleAttribute);

    const groupToColor: GroupToColor = {};
    uniqueGroups.forEach((group, index) => {
        // Ensure group is a string that can be used as an index before proceeding
        if (typeof group !== "string") {
            throw new Error("sampleAttribute must be a string");
        }
        if (sampleAttribute === "group") {
            groupToColor[group] = setNodeColor(index) || "#000";
        } else if (sampleAttribute === "sampled_at") {
            const normalizedIndex = (index + 1) / uniqueGroups.length; //normalize the index
            groupToColor[group] = setNodeGradientColor(normalizedIndex) || "#000";
        }
    });

    return groupToColor;
};

const getUniqueGroupsBySampleMetaData = (samples: SampleSchema[], sampleAttribute: keyof SampleSchema) => {
    // Extract unique groups and assign colors
    const groups = samples.map((sample) => sample[sampleAttribute]);
    const uniqueGroups = [...new Set(groups)];
    uniqueGroups.sort();
    return uniqueGroups;
};

export const getUniqueSamplingTimes = (nodes: CustomNode[]) => {
    const uniqueSamplingTimes = nodes.filter((group, index, self) => {
        return index === self.findIndex((t) => t.sampledAt === group.sampledAt);
    });
    uniqueSamplingTimes.sort((a, b) => {
        if (a.sampledAt && b.sampledAt) {
            return new Date(a.sampledAt).getTime() - new Date(b.sampledAt).getTime();
        }
        return 0;
    });
    return uniqueSamplingTimes;
};

type SampleGroupLookup = {
    [key: string]: { group: string; sampled_at: string };
};

export const transformDistanceMatrixToGraphData = (
    matrixData: DistanceMatrixSchema,
    samples: SampleSchema[],
    filter: Filter
): GraphData => {
    if (!matrixData || samples.length === 0) {
        return { nodes: [], links: [] };
    }
<<<<<<< Updated upstream

    let graph = new WeightedGraph(matrixData.matrix.length);
=======
>>>>>>> Stashed changes

    // Preprocess samples into a lookup table for filtering
    const sampleGroupLookup = samples.reduce((acc, sample) => {
        acc[sample.fasta_id] = { group: sample.group, sampled_at: sample.sampled_at };
        return acc;
    }, {} as SampleGroupLookup);

    // for the top part of the dm (as it is mirrored and the diagonal is all -1)
    // add weighted graph edges for every column-row-pair of the distance matrix
    // note that every pair is only iterated once
    // and that if a filter is set, only edges that are part of an outbreak are added
<<<<<<< Updated upstream
    for (let row = 0; row < matrixData.row_column_names.length - 1; row++) {
        for (let column = row + 1; column < matrixData.row_column_names.length; column++) {
=======
    const graphCases = cases.filter((caseData) => !!caseData.sample);
    const graph = new WeightedGraph(graphCases.length);

    for (const rowIndex of graphCases.keys()) {
        const rowCase = graphCases[rowIndex];
        console.log("row", rowCase.sample?.fasta_id);

        for (const columnIndex of graphCases.keys()) {
            const columnCase = graphCases[columnIndex];

            if (!rowCase.sample || !columnCase.sample || rowCase.case_id === columnCase.case_id) continue;

>>>>>>> Stashed changes
            // if filter is set to outbreaks, only show edges that are part of an outbreak
            if (filter === "outbreaks") {
                // get the group (e.g. outbreak_1) of the samples
                const rowGroup = sampleGroupLookup[matrixData.row_column_names[row]].group;
                const columnGroup = sampleGroupLookup[matrixData.row_column_names[column]].group;
                // if one sample is not part of an outbreak, skip this edge
                if (rowGroup === "background" || columnGroup === "background") {
                    continue;
                }
            }
<<<<<<< Updated upstream
            // add an edge for every distance
            graph.addEdge(new Edge(row, column, matrixData.matrix[row][column]));
=======

            console.log(rowIndex, columnIndex, matrixDataAssembly[rowCase.sample.fasta_id][columnCase.sample.fasta_id]);
            console.log("col", columnCase.sample?.fasta_id);

            // cases may not consist of a related samples
            // also the distance matrix assembly does not provide a distance to the currently iterated case itself
            // we therefore skip cases without related samples and the currently iterated case
            graph.addEdge(
                new Edge(rowIndex, columnIndex, matrixDataAssembly[rowCase.sample.fasta_id][columnCase.sample.fasta_id])
            );
>>>>>>> Stashed changes
        }
    }

    // calculate edges that are in the mst by using kruskal's algorithm
    const kruskal = new KruskalMST(graph);
    const mstEdges = kruskal.mst;

    const groupToColor = getGroupToColor(samples, "group");

    // create node objects
<<<<<<< Updated upstream
    let nodes = matrixData.row_column_names.map((name) => {
        const sampleMetaData = samples.find((sample) => name === sample.fasta_id);
        const group = sampleMetaData?.group || "No Group";
        return {
            id: name,
            group: sampleGroupLookup[name].group,
            color: groupToColor[group],
            sampledAt: sampleGroupLookup[name].sampled_at,
        } satisfies CustomNode;
    }) as CustomNode[];

=======
    let nodes = graphCases.map((caseData) => {
        const outbreakName = caseData?.outbreak?.name || "Background";
        return {
            id: caseData.sample ? caseData.sample.fasta_id : "",
            group: caseData.outbreak ? caseData.outbreak.name : "Background", // TODO: rename this field to "outbreak"
            //group: sampleGroupLookup[caseData.case_id].group,
            color: groupToColor[outbreakName],
            registeredAt: sampleGroupLookup[caseData.case_id].registered_at,
        } satisfies CustomNode;
    });
>>>>>>> Stashed changes
    // create link objects
    const graphLinks = mstEdges.map((edge) => {
        return {
            source: nodes[edge["v"]].id,
            target: nodes[edge["w"]].id,
            value: edge["weight"],
            type: "Solid",
        };
    }) as CustomLink[];

    // if filter is set to outbreaks, only show nodes that are part of an outbreak
    if (filter === "outbreaks") {
        // remove nodes that are not part of an outbreak
        nodes = nodes.filter((node) => node.group !== "background");
    }

    return {
        nodes: nodes,
        links: graphLinks,
    };
};
