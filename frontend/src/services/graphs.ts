import { CaseSchema, CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { CustomLink, CustomNode, GraphData } from "@/stores/graph";
import { Graph, Edge } from "@/lib/kruskal";
import { AnalysisSettings, SelectedBackground } from "@/stores/analysis";
import { OutbreakSchema } from "@/database/outbreak";
import { getDistancesFromSampleIdsBelowThreshold } from "@/database/distances";

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

const filterCasesByOutbreak = (cases: CaseWithRelationships[], selectedOutbreak: OutbreakSchema) => {
    return cases.filter((caseData) => caseData.outbreak_id === selectedOutbreak.id);
};

const filterCasesByGroupsAndOutbreaks = (cases: CaseWithRelationships[], selectedBackground: SelectedBackground) => {
    return cases.filter(
        (caseData) =>
            selectedBackground.outbreaks.some((outbreak) => caseData.outbreak_id === outbreak.id) ||
            selectedBackground.groups.some((group) => caseData.group_ids.includes(group.id))
    );
};

const filterCasesByBackground = (cases: CaseWithRelationships[]) => {
    return cases.filter((caseData) => caseData.outbreak_id === null);
};

const deleteDuplicateCases = (cases: CaseWithRelationships[]) => {
    return cases.filter((caseData, index, self) => {
        return index === self.findIndex((t) => t.id === caseData.id);
    });
};

const filterCasesByGeneticDistanceThreshold = async (
    cases: CaseWithRelationships[],
    currentGraphCases: CaseWithRelationships[],
    selectedOutbreak: OutbreakSchema,
    geneticDistanceThreshold: number
) => {
    const casesOfSelectedOutbreak = filterCasesByOutbreak(cases, selectedOutbreak);
    const sampleIdsOfCasesInSelectedOutbreak = casesOfSelectedOutbreak.map((caseData) => caseData.sample?.id ?? -1);

    const distancesBelowThreshold = await getDistancesFromSampleIdsBelowThreshold(
        sampleIdsOfCasesInSelectedOutbreak,
        geneticDistanceThreshold
    );

    const sampleIdsBelowThreshold = distancesBelowThreshold.reduce((acc, distance) => {
        acc.push(distance.sample_id_1, distance.sample_id_2);
        return acc;
    }, [] as number[]);

    const sampleIdsWithoutDuplicates = Array.from(new Set(sampleIdsBelowThreshold));

    const casesWithLowGeneticDistance = currentGraphCases.filter((caseData) =>
        sampleIdsWithoutDuplicates.includes(caseData.sample?.id ?? -1)
    );
    return casesWithLowGeneticDistance;
};

const getGraphCases = async (cases: CaseWithRelationships[], analysisSettings: AnalysisSettings) => {
    const {
        selectedOutbreak,
        includeCasesWithoutOutbreak,
        ignoreBackground,
        selectedBackground,
        geneticDistanceThreshold,
        includeCasesWithLowGeneticDistance,
    } = analysisSettings;

    // filter out cases without a sample -> Maybe removed in the future
    let graphCases = [] as CaseWithRelationships[];

    // get cases from outbreak
    if (selectedOutbreak) {
        graphCases = filterCasesByOutbreak(cases, selectedOutbreak);
    }

    // use all cases without any filtering
    if (analysisSettings.includeAllCases) {
        graphCases = cases;
    }

    // use cases which are selected in the multiselect field
    if (selectedBackground) {
        const filteredCasesByBackground = filterCasesByGroupsAndOutbreaks(cases, selectedBackground);
        graphCases = graphCases.concat(filteredCasesByBackground);
    }

    // use cases which are not assigned to any outbreak
    if (includeCasesWithoutOutbreak) {
        const casesWithoutOutbreak = filterCasesByBackground(cases);
        graphCases = graphCases.concat(casesWithoutOutbreak);
    }

    // use cases which have a distance below the threshold AND are connected to the selected outbreak
    if (includeCasesWithLowGeneticDistance && selectedOutbreak) {
        const casesWithLowGeneticDistance = await filterCasesByGeneticDistanceThreshold(
            cases,
            graphCases,
            selectedOutbreak,
            geneticDistanceThreshold
        );
        const casesOfSelectedOutbreak = filterCasesByOutbreak(cases, selectedOutbreak);
        graphCases = casesOfSelectedOutbreak.concat(casesWithLowGeneticDistance);
    }

    // disable background cases by filtering outbreak cases
    if (ignoreBackground && selectedOutbreak) {
        graphCases = filterCasesByOutbreak(cases, selectedOutbreak);
    }

    // filter out cases which are not in the selected time range
    if (analysisSettings.excludeCasesOutsideOfDateRange && analysisSettings.dateRange) {
        graphCases = graphCases.filter((caseData) => {
            const caseWasRegistered = caseData.registered_at.getTime();
            const startDate = analysisSettings.dateRange.from?.getTime() ?? 0;
            const endDate = analysisSettings.dateRange.to?.getTime() ?? Infinity;
            return caseWasRegistered >= startDate && caseWasRegistered <= endDate;
        });
    }

    // to calculate the mst with the genetic distance we have to filter out cases without a fasta_id
    graphCases = graphCases.filter((caseData) => caseData.sample);

    // it can happen that the graphCases has duplicated cases. Example: A case is in a selected
    // group and in background (not outbreak). The cases is added twice to the graphCases array
    // to prevent rendering the same case multiple times we filter out duplicates in the end
    graphCases = deleteDuplicateCases(graphCases);

    return graphCases;
};

const createMSTEdges = (
    graphCases: CaseWithRelationships[],
    matrixDataAssembly: DistanceMatrixAssembly,
    graph: Graph
) => {
    // the column loop starts with rowIndex + 1 to prevent looping over cases which are already treated
    // because of that rowIndex is stopping with graphCases.length - 1
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
    return graph.kruskal();
};

export const createGraphData = async (
    matrixDataAssembly: DistanceMatrixAssembly,
    cases: CaseWithRelationships[],
    analysisSettings: AnalysisSettings
): Promise<GraphData> => {
    if (!matrixDataAssembly || cases.length === 0) {
        return { nodes: [], links: [] };
    }

    // apply all filtering settings to get the correct cases for the graph
    const graphCases = await getGraphCases(cases, analysisSettings);

    // create a new graph object with the correct amount of nodes
    const graph = new Graph(graphCases.length);

    // calculate edges that are in the mst by using kruskal's algorithm
    const mstEdges = createMSTEdges(graphCases, matrixDataAssembly, graph);

    const groupToColor = getGroupToColor(cases, "outbreak_id");

    // create node objects for forced directed graph
    let nodes = graphCases.map((caseData) => {
        const outbreakName = caseData?.outbreak?.name || "Background";
        return {
            id: caseData.id,
            caseId: caseData.case_id,
            group: caseData.outbreak ? caseData.outbreak.name : "Background",
            color: groupToColor[outbreakName],
            registeredAt: caseData.registered_at.toLocaleDateString(),
        } satisfies CustomNode;
    });

    // create link objects for forced directed graph
    const graphLinks = mstEdges.map((edge) => {
        return {
            source: graphCases[edge.source].id,
            target: graphCases[edge.target].id,
            value: edge.weight,
            type: "Solid",
        };
    }) as CustomLink[];

    return {
        nodes: nodes,
        links: graphLinks,
    };
};

export const transformDistanceMatrixToGraphData = (
    matrixDataAssembly: DistanceMatrixAssembly,
    cases: CaseWithRelationships[]
): GraphData => {
    if (!matrixDataAssembly || cases.length === 0) {
        return { nodes: [], links: [] };
    }

    // filter out cases without a sample and apply no other filtering settings -> Will be changed in the future
    const graphCases: CaseWithRelationships[] = cases.filter((caseData) => !!caseData.sample); // filter out cases without a sample

    // create a new graph object with the correct amount of nodes
    const graph = new Graph(graphCases.length);

    // calculate edges that are in the mst by using kruskal's algorithm
    const mstEdges = createMSTEdges(graphCases, matrixDataAssembly, graph);

    const groupToColor = getGroupToColor(cases, "outbreak_id");

    // create node objects
    let nodes = graphCases.map((caseData) => {
        const outbreakName = caseData?.outbreak?.name || "Background";
        return {
            id: caseData.id,
            caseId: caseData.case_id,
            group: caseData.outbreak ? caseData.outbreak.name : "Background",
            color: groupToColor[outbreakName],
            registeredAt: caseData.registered_at.toLocaleDateString(),
        } satisfies CustomNode;
    });

    // create link objects
    const graphLinks = mstEdges.map((edge) => {
        return {
            source: graphCases[edge.source].id,
            target: graphCases[edge.target].id,
            value: edge.weight,
            type: "Solid",
        };
    }) as CustomLink[];

    return {
        nodes: nodes,
        links: graphLinks,
    };
};
