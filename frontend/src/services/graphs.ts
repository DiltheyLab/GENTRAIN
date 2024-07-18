import { CaseSchema, CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { DistanceMatrixSchema } from "@/database/distance_matrix";
import { CustomLink, CustomNode, Filter, GraphData } from "@/stores/graph";
import { Edge, KruskalMST, WeightedGraph } from "js-graph-algorithms";

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

export const getGroupToColor = (cases: CaseWithRelationships[], caseAttribute: keyof CaseSchema) => {
    // Extract unique groups and assign colors
    const uniqueGroups = getUniqueGroupsByCaseMetaData(cases, caseAttribute);

    const groupToColor: GroupToColor = {};
    uniqueGroups.forEach((group, index) => {
        // Ensure group is a string that can be used as an index before proceeding
        if (typeof group !== "string" && typeof group !== "number") {
            throw new Error("caseAttribute must be a string");
        }
        if (caseAttribute === "outbreak_id") {
            if (group === "Background") {
                groupToColor[group] = "#D3D2D2";
            } else {
                groupToColor[group] = setNodeColor(index) || "#000";
            }
        } else if (caseAttribute === "registered_at") {
            const normalizedIndex = (index + 1) / uniqueGroups.length; //normalize the index
            groupToColor[group] = setNodeGradientColor(normalizedIndex) || "#000";
        }
    });
    return groupToColor;
};

const getUniqueGroupsByCaseMetaData = (cases: CaseWithRelationships[], caseAttribute: keyof CaseSchema) => {
    // Extract unique groups and assign colors
    const groups = cases
        .map((caseData) => {
            if (caseAttribute === "registered_at") {
                let attribute: Date = caseData[caseAttribute];
                return attribute?.toLocaleDateString();
            }
            if (caseAttribute === "outbreak_id") {
                return caseData.outbreak ? caseData.outbreak.name : "Background";
            }
            return caseData[caseAttribute];
        })
        .filter((group) => group);
    const uniqueGroups = [...new Set(groups)];
    uniqueGroups.sort();
    return uniqueGroups;
};

export const getUniqueSamplingTimes = (nodes: CustomNode[]) => {
    const uniqueSamplingTimes = nodes.filter((group, index, self) => {
        return index === self.findIndex((t) => t.registeredAt === group.registeredAt);
    });
    uniqueSamplingTimes.sort((a, b) => {
        if (a.registeredAt && b.registeredAt) {
            return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
        }
        return 0;
    });
    return uniqueSamplingTimes;
};

type SampleGroupLookup = {
    [key: string]: { group: string; registered_at: string };
};

export const transformDistanceMatrixToGraphData = (
    matrixDataAssembly: DistanceMatrixAssembly,
    cases: CaseWithRelationships[],
    filter: Filter
): GraphData => {
    if (!matrixDataAssembly || cases.length === 0) {
        return { nodes: [], links: [] };
    }
    const rowColumnNames = cases.filter((caseData) => caseData.sample !== null).map((caseData) => caseData.case_id);

    let graph = new WeightedGraph(rowColumnNames.length);

    // Preprocess samples into a lookup table for filtering
    const sampleGroupLookup = cases.reduce((acc, caseData) => {
        acc[caseData.case_id] = {
            group: caseData.outbreak ? caseData.outbreak.name : "Background",
            registered_at: caseData.registered_at.toLocaleDateString(),
        };
        return acc;
    }, {} as SampleGroupLookup);

    // for the top part of the dm (as it is mirrored and the diagonal is all -1)
    // add weighted graph edges for every column-row-pair of the distance matrix
    // note that every pair is only iterated once
    // and that if a filter is set, only edges that are part of an outbreak are added
    for (const rowIndex of cases.keys()) {
        for (const columnIndex of cases.keys()) {
            const rowCase = cases[rowIndex];
            const columnCase = cases[columnIndex];

            // if filter is set to outbreaks, only show edges that are part of an outbreak
            if (filter === "outbreaks") {
                // get the group (e.g. outbreak_1) of the samples
                const rowGroup = sampleGroupLookup[rowCase.case_id].group;
                const columnGroup = sampleGroupLookup[columnCase.case_id].group;
                // if one sample is not part of an outbreak, skip this edge
                if (rowGroup === "Background" || columnGroup === "Background") {
                    continue;
                }
            }
            // add an edge for every distance
            if (rowCase.sample && columnCase.sample) {
                graph.addEdge(
                    new Edge(
                        rowIndex,
                        columnIndex,
                        matrixDataAssembly[rowCase.sample.fasta_id][columnCase.sample.fasta_id]
                    )
                );
            }
        }
    }

    // calculate edges that are in the mst by using kruskal's algorithm
    const kruskal = new KruskalMST(graph);
    const mstEdges = kruskal.mst;

    const groupToColor = getGroupToColor(cases, "outbreak_id");
    // create node objects
    let nodes = rowColumnNames.map((name) => {
        const caseMetaData = cases.find((caseData) => name === caseData.case_id);
        const group = caseMetaData?.outbreak?.name || "Background";
        return {
            id: name,
            group: sampleGroupLookup[name].group,
            color: groupToColor[group],
            registeredAt: sampleGroupLookup[name].registered_at,
        } satisfies CustomNode;
    }) as CustomNode[];
    // create link objects
    const graphLinks = mstEdges.map((edge) => {
        return { source: nodes[edge["v"]].id, target: nodes[edge["w"]].id, value: edge["weight"], type: "Solid" };
    }) as CustomLink[];

    // if filter is set to outbreaks, only show nodes that are part of an outbreak
    if (filter === "outbreaks") {
        // remove nodes that are not part of an outbreak
        nodes = nodes.filter((node) => node.group !== "Background");
    }

    return {
        nodes: nodes,
        links: graphLinks,
    };
};
