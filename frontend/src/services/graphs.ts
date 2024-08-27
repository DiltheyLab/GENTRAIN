import { CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { Graph, Link } from "@/lib/kruskal";
import { AnalysisSettings, SelectedBackground, useAnalysisStore } from "@/stores/analysis";
import { getDistancesFromSampleIdsBelowThreshold } from "@/database/distances";
import { DateRange } from "react-day-picker";
import { CustomNode, CustomLink, GraphData, ColorMap, ContactLinksColorMap } from "@/types/graph";
import { ContactSchema } from "@/database/contacts";
import { OutbreakSchema } from "@/database/outbreaks";
import {
    COLOR_FOR_CASES_WITHOUT_OUTBREAKS,
    COLOR_FOR_GENETIC_DISTANCE_LINKS,
    COLOR_FOR_SELECTED_OUTBREAK,
    COLOR_PALETTE_LINKS,
    COLOR_PALETTE_NODES,
} from "@/colors/colorPalettes";
import { parseGermanDateFormat } from "./dates";
import i18next from "i18next";

export const getSelectedClusters = () => {
    const analysisStore = useAnalysisStore.getState();
    const clustersOfNodes = getUniqueClustersOfNodes(analysisStore.graphData.nodes);
    const selectedOutbreak = clustersOfNodes.filter(
        (nodes) => nodes.cluster === analysisStore.settings.selectedOutbreak?.name
    );
    const selectedBackground = clustersOfNodes.filter(
        (nodes) => nodes.cluster !== analysisStore.settings.selectedOutbreak?.name
    );
    return { selectedOutbreak, selectedBackground };
};

export const createColorMapForNodes = (cases: CaseWithRelationships[], selectedOutbreak: OutbreakSchema | null) => {
    const clusters = getUniqueClusterOfCases(cases);
    const sortedClusters = sortClusterByOutbreakAndBackground(clusters);
    const noOutbreakAssignedExists = sortedClusters.indexOf(i18next.t("clusterTypes.noOutbreakAssigned"));
    const colorMap = {} as ColorMap;

    // the selected outbreak is the first cluster
    const selectedOutbreakCluster = sortedClusters[0];

    // "keinem Ausbruch zugewiesen" is the last cluster
    const noOutbreakAssignedCluster = sortedClusters[sortedClusters.length - 1];

    if (selectedOutbreak) {
        colorMap[selectedOutbreakCluster] = { color: COLOR_FOR_SELECTED_OUTBREAK, isActive: true };
        sortedClusters.splice(0, 1);
    }

    if (noOutbreakAssignedExists !== -1) {
        colorMap[noOutbreakAssignedCluster] = {
            color: COLOR_FOR_CASES_WITHOUT_OUTBREAKS,
            isActive: true,
        };
        sortedClusters.pop();
    }

    for (let i = 0; i < sortedClusters.length; i++) {
        // create colors for every cluster. If there are more clusters then colors create a color dynamically
        colorMap[sortedClusters[i]] = { color: COLOR_PALETTE_NODES[i] || createColorByIndex(i), isActive: true };
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
    let uniqueClustersOfNodes = nodes
        .filter((cluster, index, self) => {
            return index === self.findIndex((node) => node.cluster === cluster.cluster);
        })
        .sort((a, b) => a.cluster.localeCompare(b.cluster));

    //find the index of the cluster "Keinem Ausbruch zugewiesen" and put it at the end of the array
    const index = uniqueClustersOfNodes.findIndex(
        (node) => node.cluster === i18next.t("clusterTypes.noOutbreakAssigned")
    );
    if (index !== -1) {
        const item = uniqueClustersOfNodes.splice(index, 1);
        uniqueClustersOfNodes.push(item[0]);
    }
    return uniqueClustersOfNodes;
};

export const getUniqueClusters = (nodes: CustomNode[]) => {
    const clusters = nodes.map((node) => node.cluster);
    const uniqueClusters = [...new Set(clusters)].sort();
    return uniqueClusters;
};

export const sortClusterByOutbreakAndBackground = (clusters: string[]) => {
    const outbreak = useAnalysisStore.getState().settings.selectedOutbreak?.name;
    let sortedClusters = [...clusters];
    //find the index of the cluster "keinem Ausbruch zugewiesen" and put it at the end of the array
    const indexOfBackground = sortedClusters.findIndex(
        (sortedCluster) => sortedCluster === i18next.t("clusterTypes.noOutbreakAssigned")
    );
    if (indexOfBackground !== -1) {
        const item = sortedClusters.splice(indexOfBackground, 1);
        sortedClusters.push(item[0]);
    }

    //find the index of the cluster selected outbreak and put it in the front of the array
    const indexOfOutbreak = sortedClusters.findIndex((sortedCluster) => sortedCluster === outbreak);
    if (indexOfOutbreak !== -1) {
        const item = sortedClusters.splice(indexOfOutbreak, 1);
        sortedClusters.unshift(item[0]);
    }
    return sortedClusters;
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
    const nodes: CustomNode[] = graphCases.map((caseData) => {
        return {
            id: caseData.id,
            caseId: caseData.case_id,
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
