import { CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { Graph, Link } from "@/lib/graph";
import { AnalysisSettings, SelectedBackground, useAnalysisStore } from "@/stores/analysis";
import { getDistancesFromSampleIdsBelowThreshold } from "@/database/distances";
import { DateRange } from "react-day-picker";
import { CustomNode, CustomLink, GraphData, ColorMap, ContactLinksColorMap } from "@/types/graph";
import { ContactSchema } from "@/database/contacts";
import { OutbreakSchema } from "@/database/outbreaks";
import {
    COLOR_FOR_CASES_WITHOUT_CLUSTERS,
    COLOR_FOR_GENETIC_DISTANCE_LINKS,
    COLOR_FOR_SELECTED_OUTBREAK,
    COLOR_PALETTE_LINKS,
    COLOR_PALETTE_NODES,
} from "@/colors/colorPalettes";
import { parseGermanDateFormat } from "./dates";
import i18next from "i18next";

export const getSelectedClusters = () => {
    const analysisStore = useAnalysisStore.getState();
    let clustersOfNodes = getUniqueClustersOfNodes(analysisStore.graphData.nodes);
    clustersOfNodes = sortNoOutbreakAssignedToEndOfArray(clustersOfNodes);
    const selectedOutbreak = clustersOfNodes.filter(
        (nodes) => nodes.cluster === analysisStore.settings.selectedOutbreak?.name
    );
    const selectedBackground = clustersOfNodes.filter(
        (nodes) => nodes.cluster !== analysisStore.settings.selectedOutbreak?.name
    );
    return { selectedOutbreak, selectedBackground };
};

export const sortNoOutbreakAssignedToEndOfArray = (nodes: CustomNode[]) => {
    const clusterOfNodes = [...nodes];
    //find the index of the cluster "Keinem Ausbruch zugewiesen" and put it at the end of the array
    const index = clusterOfNodes.findIndex((node) => node.cluster === i18next.t("clusterTypes.noOutbreakAssigned"));
    if (index !== -1) {
        const item = clusterOfNodes.splice(index, 1);
        clusterOfNodes.push(item[0]);
    }
    return clusterOfNodes;
};

export const createColorMapForNodes = (
    selectedOutbreak?: OutbreakSchema,
    cases?: CaseWithRelationships[],
    nodes?: CustomNode[]
) => {
    let clusters: string[] = [];
    if (cases) {
        clusters = getUniqueClusterOfCases(cases); // get unique clusters of cases, used by the outbreak analysis
    } else if (nodes) {
        clusters = getUniqueClusters(nodes); // get unique clusters of nodes, used by the dashboard
    }

    const colorMap = {} as ColorMap;

    const noAssignedCluster = clusters.find(
        (cluster) =>
            cluster === i18next.t("clusterTypes.noOutbreakAssigned") ||
            cluster === i18next.t("clusterTypes.noClusterAssigned")
    );

    // if there is an outbreak selected give this cluster a specific color
    const selectedOutbreakCluster = clusters.find((cluster) => cluster === selectedOutbreak?.name);
    if (selectedOutbreak && selectedOutbreakCluster) {
        colorMap[selectedOutbreakCluster] = { color: COLOR_FOR_SELECTED_OUTBREAK, isActive: true };
        clusters.splice(clusters.indexOf(selectedOutbreakCluster), 1);
    }

    // if there are clusters like noOutbreakAssigned or noClusterAssigned give this cluster a specific color
    if (noAssignedCluster) {
        colorMap[noAssignedCluster] = {
            color: COLOR_FOR_CASES_WITHOUT_CLUSTERS,
            isActive: true,
        };
        clusters.splice(clusters.indexOf(noAssignedCluster), 1);
    }

    // create colors for every cluster. If there are more clusters then colors create a color dynamically
    for (let i = 0; i < clusters.length; i++) {
        colorMap[clusters[i]] = { color: COLOR_PALETTE_NODES[i] || createColorByIndex(i), isActive: true };
    }

    return colorMap;
};

export const createColorMapForTimeSpan = (nodes: CustomNode[]) => {
    const registeredAtTimestamps = getRegisteredAtTimestamps(nodes);
    const colorMap = {} as ColorMap;

    for (let i = 0; i < registeredAtTimestamps.length; i++) {
        const normalizedIndex = i / registeredAtTimestamps.length;
        colorMap[registeredAtTimestamps[i]] = { color: setNodeGradientColor(normalizedIndex) };
    }
    return colorMap;
};

export const getUniqueClustersOfNodes = (nodes: CustomNode[]) => {
    const uniqueClustersOfNodes = nodes
        .filter((cluster, index, self) => {
            return index === self.findIndex((node) => node.cluster === cluster.cluster);
        })
        .sort((a, b) => a.cluster.localeCompare(b.cluster));
    return uniqueClustersOfNodes;
};

export const getUniqueClusters = (nodes: CustomNode[]) => {
    const clusters = nodes.map((node) => node.cluster);
    const uniqueClusters = [...new Set(clusters)].sort();
    return uniqueClusters;
};

export const getUniqueTypesOfLinks = (links: CustomLink[]) => {
    return links
        .filter((link, index, self) => {
            return index === self.findIndex((l) => l.type === link.type);
        })
        .sort((a, b) => a.type.localeCompare(b.type));
};

export const createColorByIndex = (value: number) => {
    const hue = value * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
};

const setNodeGradientColor = (normalizedIndex: number): string => {
    // Interpolate hue from 70 (yellow-green) to 0 (red)
    const hue = 70 - normalizedIndex * 70;
    // Use fixed saturation and lightness values
    return `hsl(${hue}, 100%, 50%)`;
};

export const getRegisteredAtTimestamps = (nodes: CustomNode[]) => {
    const times = nodes.map((node) => node.registeredAt);
    const uniqueTimes = [...new Set(times)];

    const sortedTimes = uniqueTimes.sort((a, b) => {
        const dateA = parseGermanDateFormat(a);
        const dateB = parseGermanDateFormat(b);
        return dateA.getTime() - dateB.getTime();
    });

    return sortedTimes;
};

const getUniqueClusterOfCases = (cases: CaseWithRelationships[]) => {
    // Extract unique cluster
    const cluster = cases.map((caseData) => {
        return caseData.outbreak ? caseData.outbreak.name : i18next.t("clusterTypes.noOutbreakAssigned");
    });
    return [...new Set(cluster)];
};

const filterCasesByOutbreak = (cases: CaseWithRelationships[], selectedOutbreak: OutbreakSchema) => {
    return cases.filter((caseData) => caseData.outbreak_id === selectedOutbreak.id);
};

const filterCasesByGroupsAndOutbreaks = (cases: CaseWithRelationships[], selectedBackground: SelectedBackground) => {
    return cases.filter(
        (caseData) =>
            selectedBackground.outbreaks.some((outbreak) => caseData.outbreak_id === outbreak.id) || //include cases from selected outbreaks
            selectedBackground.groupsWithCategories.some((group) => caseData.group_ids.includes(group.id)) || //include cases from selected groups
            (selectedBackground.casesWithoutOutbreakExist && caseData.outbreak_id === null) //include cases without outbreak
    );
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

const filterCasesByDateRange = (cases: CaseWithRelationships[], dateRange: DateRange) => {
    return cases.filter((caseData) => {
        const caseWasRegisteredAt = caseData.registered_at.getTime();
        const startDate = dateRange.from?.getTime() ?? 0;
        const endDate = dateRange.to?.getTime() ?? dateRange.from?.getTime() ?? Infinity;
        return caseWasRegisteredAt >= startDate && caseWasRegisteredAt <= endDate;
    });
};

const filterCasesWithoutSample = (cases: CaseWithRelationships[]) => {
    return cases.filter((caseData) => caseData.sample);
};

const getGraphCases = async (cases: CaseWithRelationships[], analysisSettings: AnalysisSettings) => {
    const {
        selectedOutbreak,
        showBackground,
        selectedBackground,
        geneticDistanceThreshold,
        excludeCasesAboveGeneticDistanceThreshold,
        excludeCasesWithoutSequence,
    } = analysisSettings;

    let graphCases = [] as CaseWithRelationships[];

    // save cases which are in the selected outbreak to use it in the filters
    let casesInOutbreak = [] as CaseWithRelationships[];

    // *************************** SELECT OUTBREAK ********************************

    // get cases from outbreak
    if (selectedOutbreak) {
        graphCases = filterCasesByOutbreak(cases, selectedOutbreak);
        casesInOutbreak = [...graphCases];
    }

    // *************************** SELECT BACKGROUND ********************************

    // use all cases without any filtering
    if (analysisSettings.includeAllCases) {
        graphCases = [...cases];
    }

    // use cases which are selected in the multiselect field
    if (selectedBackground && !analysisSettings.includeAllCases) {
        const filteredCasesByBackground = filterCasesByGroupsAndOutbreaks(cases, selectedBackground);
        graphCases = graphCases.concat(filteredCasesByBackground);
    }

    // *************************** FILTERING ********************************

    // filter out cases which have no sequence
    if (excludeCasesWithoutSequence) {
        graphCases = filterCasesWithoutSample(graphCases);
        casesInOutbreak = filterCasesWithoutSample(casesInOutbreak);
    }

    // filter out cases which have a distance above the genetic distance threshold
    if (excludeCasesAboveGeneticDistanceThreshold && selectedOutbreak) {
        // get cases with genetic distance below threshold which are connected to a case in the selected outbreak
        const casesWithLowGeneticDistance = await filterCasesByGeneticDistanceThreshold(
            cases,
            graphCases,
            selectedOutbreak,
            geneticDistanceThreshold
        );

        // get contact cases which are left in graphCases
        const contactCases = graphCases.filter((caseData) => !caseData.sample);

        // add cases with low genetic distance to the cases in the outbreak
        graphCases = casesInOutbreak.concat(casesWithLowGeneticDistance);

        // we have to add contact cases in the end because they were filtered out by filterCasesByGeneticDistanceThreshold
        graphCases = graphCases.concat(contactCases);
    }

    // filter out cases which are not in the selected time range
    if (analysisSettings.excludeCasesOutsideOfDateRange && analysisSettings.dateRange) {
        const casesFilteredByDateRange = filterCasesByDateRange(graphCases, analysisSettings.dateRange);
        // add cases in date range to the cases in the outbreak
        graphCases = casesInOutbreak.concat(casesFilteredByDateRange);
    }

    // disable background cases by filtering outbreak cases
    if (!showBackground && selectedOutbreak) {
        graphCases = [...casesInOutbreak];
    }

    // the graphCases array contains duplicated cases. Example: A case is in a selected
    // group and in background (not outbreak). The cases is added twice to the graphCases array.
    // to prevent rendering the same case multiple times we filter out duplicates in the end instead of
    // checking for duplicates in each filter step
    graphCases = deleteDuplicateCases(graphCases);

    return graphCases;
};

const createColorMapForContactLinks = (contacts: ContactSchema[]) => {
    const contactTypes = contacts.map((contact) => contact.type);
    const uniqueContactTypes = [...new Set(contactTypes)];

    const contactLinksColorMap: ContactLinksColorMap = {};
    uniqueContactTypes.forEach((contactType, index) => {
        contactLinksColorMap[contactType] = COLOR_PALETTE_LINKS[index] || createColorByIndex(index);
    });

    return contactLinksColorMap;
};

const createCurvatures = (links: CustomLink[]) => {
    const linkMap = new Map<string, number>();

    for (let i = 0; i < links.length; i++) {
        const source = links[i].source;
        const target = links[i].target;

        // Create a unique key for each link pair
        const key = source < target ? `${source}-${target}` : `${target}-${source}`;

        // Increment the count for this link pair
        if (linkMap.has(key)) {
            linkMap.set(key, linkMap.get(key)! + 1);
        } else {
            linkMap.set(key, 1);
        }

        // Set the curvature based on the count of this link pair
        links[i].curvature = 0.2 * (linkMap.get(key)! - 1);
    }

    return links;
};

const createMSTLinks = (
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

            if (!rowCase.sample || !columnCase.sample) continue;
            graph.addLink(
                new Link(rowIndex, columnIndex, matrixDataAssembly[rowCase.sample.fasta_id][columnCase.sample.fasta_id])
            );
        }
    }

    // calculate links that are in the mst by using kruskal's algorithm
    return graph.kruskal();
};

const createContactLinks = (graphCases: CaseWithRelationships[], contacts: ContactSchema[], links: CustomLink[]) => {
    // create a array with the ids of the cases which are in the already filtered graphCases array
    const graphCasesIds = graphCases.map((caseData) => caseData.id);

    // create a color map for the contact types
    const contactLinksColorMap = createColorMapForContactLinks(contacts);

    const contactTracingLinks: CustomLink[] = [];
    // create link objects for contacts
    for (const contact of contacts) {
        // only add contact links if both contact cases are in the already filtered graphCases array
        if (graphCasesIds.includes(contact.case_id_1) && graphCasesIds.includes(contact.case_id_2)) {
            const link = {
                source: contact.case_id_1,
                target: contact.case_id_2,
                value: "",
                color: contactLinksColorMap[contact.type],
                type: contact.type,
                context: contact.context,
                curvature: 0,
            } satisfies CustomLink;
            contactTracingLinks.push(link);
        }
    }

    // add contact links to the already existing mst links
    links = links.concat(contactTracingLinks);

    // calculate curvatures for the links because now we have more than one link between two nodes
    links = createCurvatures(links);

    return links;
};

export const createGraphData = async (
    matrixDataAssembly: DistanceMatrixAssembly,
    cases: CaseWithRelationships[],
    analysisSettings: AnalysisSettings,
    contacts: ContactSchema[]
): Promise<GraphData> => {
    if (!matrixDataAssembly || cases.length === 0) {
        return { nodes: [], links: [] };
    }

    // apply all filtering settings to get the correct cases for the graph
    const graphCases = await getGraphCases(cases, analysisSettings);

    // create a new graph object with the correct amount of nodes
    const graph = new Graph(graphCases.length);

    // calculate links that are in the mst by using kruskal's algorithm
    const mstLinks = createMSTLinks(graphCases, matrixDataAssembly, graph);

    // create node objects for forced directed graph
    let nodes: CustomNode[] = graphCases.map((caseData) => {
        return {
            id: caseData.id,
            caseData: caseData,
            cluster: caseData.outbreak ? caseData.outbreak.name : i18next.t("clusterTypes.noOutbreakAssigned"),
            registeredAt: caseData.registered_at.toLocaleDateString(),
        } satisfies CustomNode;
    });

    // create link objects for sequenced cases (MST)
    let links = mstLinks.map((link) => {
        return {
            source: graphCases[link.source].id,
            target: graphCases[link.target].id,
            value: link.weight.toString(),
            color: COLOR_FOR_GENETIC_DISTANCE_LINKS,
            curvature: 0,
            type: i18next.t("linkTypes.geneticDistance"),
            context: "",
        };
    }) satisfies CustomLink[];

    // create link objects for contacts
    if (analysisSettings.showContactTracingLinks && contacts) {
        links = createContactLinks(graphCases, contacts, links);
    }

    return {
        nodes: nodes,
        links: links,
    };
};

export const findClustersOfNodes = (graphData: GraphData, clusteringThreshold: number, minClusterSize = 2) => {
    //delete links above clusteringThreshold to find clusters in the graph
    const linksAboveThreshold = graphData.links.filter((link) => +link.value <= clusteringThreshold);
    const formatedLinks: Link[] = linksAboveThreshold.map((link) => {
        return { source: link.source, target: link.target, weight: +link.value };
    });

    const graph = new Graph(
        graphData.nodes.length,
        graphData.nodes.map((node) => node.id),
        formatedLinks
    );

    //all connected nodes build a component
    const components = graph.getConnectedComponents();

    //all components above the clusteringThreshold build a cluster
    const clusters = components.filter((component) => component.length >= minClusterSize);

    //create the components map where the key is the case id and the value is the cluster name
    const componentsMap = new Map<number, string>();
    for (let i = 0; i < clusters.length; i++) {
        for (let j = 0; j < clusters[i].length; j++) {
            componentsMap.set(clusters[i][j], `Cluster ${i + 1}`);
        }
    }

    //overwrite the clusters name. If there is no key for the case id in the components map, the node belongs not to a cluster
    const nodes = graphData.nodes.map((node) => {
        return { ...node, cluster: componentsMap.get(node.id) ?? i18next.t("clusterTypes.noClusterAssigned") };
    });

    return { nodes, clusters };
};
