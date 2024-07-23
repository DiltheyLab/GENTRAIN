import { CaseSchema, CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { CustomLink, CustomNode, GraphData } from "@/stores/graph";
import { Graph, Edge } from "@/lib/kruskal";

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

export const transformDistanceMatrixToGraphData = (
    matrixDataAssembly: DistanceMatrixAssembly,
    cases: CaseWithRelationships[],
    selectedOutbreak = ""
): GraphData => {
    if (!matrixDataAssembly || cases.length === 0) {
        return { nodes: [], links: [] };
    }

    // filter out cases without a sample
    let graphCases = cases.filter((caseData) => !!caseData.sample);

    // if filter is set to outbreaks, only show cases that are part of an outbreak
    if (selectedOutbreak) {
        graphCases = graphCases.filter(
            (caseData) => caseData.outbreak_id !== null && caseData.outbreak?.name !== selectedOutbreak
        );
    }

    const graph = new Graph(graphCases.length);

    // for the top part of the dm (as it is mirrored and the diagonal is all -1)
    // add weighted graph edges for every column-row-pair of the distance matrix
    // note that every pair is only iterated once
    for (let rowIndex = 0; rowIndex < graphCases.length - 1; rowIndex++) {
        const rowCase = graphCases[rowIndex];

        for (let columnIndex = rowIndex + 1; columnIndex < graphCases.length; columnIndex++) {
            const columnCase = graphCases[columnIndex];

            graph.addEdge(
                new Edge(
                    rowIndex,
                    columnIndex,
                    matrixDataAssembly[rowCase.sample!.fasta_id][columnCase.sample!.fasta_id]
                )
            );
        }
    }

    // calculate edges that are in the mst by using kruskal's algorithm
    const mstEdges = graph.kruskal();

    const groupToColor = getGroupToColor(cases, "outbreak_id");
    // create node objects
    let nodes = graphCases.map((caseData) => {
        const outbreakName = caseData?.outbreak?.name || "Background";
        return {
            id: caseData.sample?.fasta_id || "unknown",
            group: caseData.outbreak ? caseData.outbreak.name : "Background", // TODO: rename this field to "outbreak"
            color: groupToColor[outbreakName],
            registeredAt: caseData.registered_at.toLocaleDateString(),
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

    return {
        nodes: nodes,
        links: graphLinks,
    };
};
