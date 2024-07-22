import { CaseSchema, CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { CustomLink, CustomNode, Filter, GraphData } from "@/stores/graph";
import * as jsgraph from "js-graph-algorithms";

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

    const graphCases = cases.filter((caseData) => !!caseData.sample);
    const graph = new jsgraph.WeightedGraph(graphCases.length);

    console.log(matrixDataAssembly);
    for (const rowIndex of graphCases.keys()) {
        const rowCase = graphCases[rowIndex];

        for (const columnIndex of graphCases.keys()) {
            const columnCase = graphCases[columnIndex];

            if (!rowCase.sample || !columnCase.sample || rowCase.case_id === columnCase.case_id) continue;

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

            // cases may not consist of a related samples
            // also the distance matrix assembly does not provide a distance to the currently iterated case itself
            // we therefore skip cases without related samples and the currently iterated case
            graph.addEdge(
                new jsgraph.Edge(
                    rowIndex,
                    columnIndex,
                    matrixDataAssembly[rowCase.sample.fasta_id][columnCase.sample.fasta_id]
                )
            );
        }
    }

    // calculate edges that are in the mst by using kruskal's algorithm
    const kruskal = new jsgraph.KruskalMST(graph);
    const mstEdges = kruskal.mst;

    const groupToColor = getGroupToColor(cases, "outbreak_id");
    // create node objects
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
        nodes = nodes.filter((node) => node.group !== "Background");
    }

    return {
        nodes: nodes,
        links: graphLinks,
    };
};
