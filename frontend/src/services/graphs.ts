import { CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { Graph, Link } from "@/lib/kruskal";
import { AnalysisSettings, SelectedBackground } from "@/stores/analysis";
import { getDistancesFromSampleIdsBelowThreshold } from "@/database/distances";
import { DateRange } from "react-day-picker";
import { CustomNode, CustomLink, GraphData } from "@/types/graph";
import { ContactSchema } from "@/database/contacts";
import { OutbreakSchema } from "@/database/outbreaks";
import { COLORPALETTELINKS } from "@/colors/colorPalettes";

export const setNodeColor = (value: number) => {
    const hue = value * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
};

/* const setNodeGradientColor = (normalizedIndex: number): string => {
    // Interpolate hue from 240 (blue) to 0 (red)
    const hue = 70 - normalizedIndex * 70;
    // Use fixed saturation and lightness values
    return `hsl(${hue}, 100%, 50%)`;
}; */

type ColorMapForClusters = {
    [key: string]: string;
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

const getUniqueClusterOfCases = (cases: CaseWithRelationships[]) => {
    // Extract unique cluster
    const cluster = cases.map((caseData) => {
        return caseData.outbreak ? caseData.outbreak.name : "Keinem Ausbruch zugewiesen";
    });
    return [...new Set(cluster)];
};

const sortCluster = (uniqueCluster: string[], selectedOutbreak: OutbreakSchema | null) => {
    const sortedCluster = uniqueCluster.sort();

    //find the index of the group "Keinem Ausbruch zugewiesen" and put it at the end of the array
    const noOutbreakIndex = sortedCluster.indexOf("Keinem Ausbruch zugewiesen");
    if (noOutbreakIndex !== -1) {
        sortedCluster.splice(noOutbreakIndex, 1);
        sortedCluster.push("Keinem Ausbruch zugewiesen");
    }

    // if no outbreak is selected return the sorted cluster -> no special sorting needed for dashboard graph
    if (!selectedOutbreak) return sortedCluster;

    // find the index of the selected outbreak in the sorted cluster and put it at the beginning of the array
    const outbreakIndex = sortedCluster.indexOf(selectedOutbreak?.name);
    if (outbreakIndex !== -1) {
        sortedCluster.splice(outbreakIndex, 1);
        sortedCluster.unshift(selectedOutbreak?.name);
    }

    return sortedCluster;
};

export const createColorMapForClusters = (cases: CaseWithRelationships[], analysisSettings: AnalysisSettings) => {
    const selectedOutbreak = analysisSettings.selectedOutbreak;
    const colorPalette = analysisSettings.colorPaletteNodes;

    // Extract unique cluster
    const uniqueCluster = getUniqueClusterOfCases(cases);

    // Sort cluster that the selected outbreak is at the beginning of the array and the cluster "Keinem Ausbruch zugewiesen" at the end
    const sortedCluster = sortCluster(uniqueCluster as string[], selectedOutbreak);

    const colorMapForClusters: ColorMapForClusters = {};
    sortedCluster.forEach((cluster, index) => {
        if (cluster === "Keinem Ausbruch zugewiesen") {
            // the cluster "Keinem Ausbruch zugewiesen" gets a grey color which is always the last color in the color palette
            colorMapForClusters[cluster] = colorPalette[colorPalette.length - 1];
        } else {
            // the color pallete has 34 specific colors
            // if there are more clusters than colors we use the setNodeColor function to generate a color
            colorMapForClusters[cluster] = colorPalette[index] || setNodeColor(index);
        }
    });

    return colorMapForClusters;
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

        // Fall 1: Es gibt nur Fälle mit genetischer distanz

        // because we only want to show cases which have a distance below the threshold and are connected to the selected outbreak
        // we have to filter out cases without a sample because they have no distance
        //graphCases = filterCasesWithoutSample(graphCases);
        //casesInOutbreak = filterCasesWithoutSample(casesInOutbreak);

        // Fall2: Die Kontaktfälle bleiben auch ohne genetische Distanz erhalten
        const contactCases = graphCases.filter((caseData) => !caseData.sample);

        // add cases with low genetic distance to the cases in the outbreak
        graphCases = casesInOutbreak.concat(casesWithLowGeneticDistance);

        // -> gehört zu Fall 2
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

const createColorMapForContacts = (contacts: ContactSchema[]) => {
    const contactTypes = contacts.map((contact) => contact.type);
    const uniqueContactTypes = [...new Set(contactTypes)];

    const colorMapForContacts: ColorMapForClusters = {};
    uniqueContactTypes.forEach((contactType, index) => {
        colorMapForContacts[contactType] = COLORPALETTELINKS[index] || setNodeColor(index);
    });

    return colorMapForContacts;
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
    const colorMapForContacts = createColorMapForContacts(contacts);

    const contactTracingLinks: CustomLink[] = [];
    // create link objects for contacts
    for (const contact of contacts) {
        // only add contact links if both contact cases are in the already filtered graphCases array
        if (graphCasesIds.includes(contact.case_id_1) && graphCasesIds.includes(contact.case_id_2)) {
            const link = {
                source: contact.case_id_1,
                target: contact.case_id_2,
                value: "",
                color: colorMapForContacts[contact.type],
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

    const colorMapForClusters = createColorMapForClusters(cases, analysisSettings);

    // create node objects for forced directed graph
    const nodes: CustomNode[] = graphCases.map((caseData) => {
        const outbreakName = caseData?.outbreak?.name || "Keinem Ausbruch zugewiesen";

        return {
            id: caseData.id,
            caseId: caseData.case_id,
            caseData: caseData,
            cluster: caseData.outbreak ? caseData.outbreak.name : "Keinem Ausbruch zugewiesen",
            color: colorMapForClusters[outbreakName],
            registeredAt: caseData.registered_at.toLocaleDateString(),
        } satisfies CustomNode;
    });

    // create link objects for sequenced cases (MST)
    let links = mstLinks.map((link) => {
        return {
            source: graphCases[link.source].id,
            target: graphCases[link.target].id,
            value: link.weight.toString(),
            color: "#CCC",
            curvature: 0,
            type: "Genetische Distanz",
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
