import { CaseSchema, CaseWithRelationships } from "@/database/cases";
import { DistanceMatrixAssembly } from "@/database/distance_matrices";
import { Graph, Edge } from "@/lib/kruskal";
import { AnalysisSettings, SelectedBackground } from "@/stores/analysis";
import { getDistancesFromSampleIdsBelowThreshold } from "@/database/distances";
import { DateRange } from "react-day-picker";
import { CustomNode, CustomLink, GraphData } from "@/types/graph";
import { ContactSchema } from "@/database/contacts";
import { OutbreakSchema } from "@/database/outbreaks";

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
            if (group === "Keinem Ausbruch zugewiesen") {
                groupToColor[group] = "#CCC";
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
                return caseData.outbreak ? caseData.outbreak.name : "Keinem Ausbruch zugewiesen";
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

const filterCasesByDateRange = (graphCases: CaseWithRelationships[], dateRange: DateRange) => {
    return graphCases.filter((caseData) => {
        const caseWasRegisteredAt = caseData.registered_at.getTime();
        const startDate = dateRange.from?.getTime() ?? 0;
        const endDate = dateRange.to?.getTime() ?? dateRange.from?.getTime() ?? Infinity;
        return caseWasRegisteredAt >= startDate && caseWasRegisteredAt <= endDate;
    });
};

const getGraphCases = async (
    cases: CaseWithRelationships[],
    analysisSettings: AnalysisSettings,
    contacts: ContactSchema[]
) => {
    const {
        selectedOutbreak,
        showBackground,
        selectedBackground,
        geneticDistanceThreshold,
        includeCasesWithLowGeneticDistance,
    } = analysisSettings;

    let graphCases = [] as CaseWithRelationships[];

    // save cases which are in the selected outbreak to use it in the filters
    let casesInOutbreak = [] as CaseWithRelationships[];

    // get cases from outbreak
    if (selectedOutbreak) {
        graphCases = filterCasesByOutbreak(cases, selectedOutbreak);
        casesInOutbreak = [...graphCases];
    }

    // use all cases without any filtering
    if (analysisSettings.includeAllCases) {
        graphCases = [...cases];
    }

    // use cases which are selected in the multiselect field
    if (selectedBackground && !analysisSettings.includeAllCases) {
        const filteredCasesByBackground = filterCasesByGroupsAndOutbreaks(cases, selectedBackground);
        graphCases = graphCases.concat(filteredCasesByBackground);
    }

    // use cases which have a distance below the threshold AND are connected to the selected outbreak
    if (includeCasesWithLowGeneticDistance && selectedOutbreak) {
        const casesWithLowGeneticDistance = await filterCasesByGeneticDistanceThreshold(
            cases,
            graphCases,
            selectedOutbreak,
            geneticDistanceThreshold
        );

        // if we want to show only cases with low genetic distance we have to filter out cases which have no samples like contact cases
        // graphCases = graphCases.filter((graphCase) => graphCase.sample);
        // casesInOutbreak = casesInOutbreak.filter((graphCase) => graphCase.sample);

        //if we want to show contacts later we have to keep the contact cases in the graphCases array instead of filtering them out in line 190
        // the reason for that is that there are no contact cases in the casesWithLowGeneticDistance array and only the contact cases from the casesInOutbreak array

        // add cases with low genetic distance to the cases in the outbreak
        graphCases = casesInOutbreak.concat(casesWithLowGeneticDistance);
    }

    // disable background cases by filtering outbreak cases
    if (!showBackground && selectedOutbreak) {
        graphCases = [...casesInOutbreak];
    }

    // filter out cases which are not in the selected time range
    if (analysisSettings.excludeCasesOutsideOfDateRange && analysisSettings.dateRange) {
        const casesFilteredByDateRange = filterCasesByDateRange(graphCases, analysisSettings.dateRange);
        // add cases in date range to the cases in the outbreak
        graphCases = casesInOutbreak.concat(casesFilteredByDateRange);
    }

    if (analysisSettings.showContactTracingEdges) {
        const allContactCases: CaseWithRelationships[] = graphCases.filter((caseData) => !caseData.sample);

        //Fall: 1
        //wenn wir nur kontaktfälle amzeigen wollen die mit Fällen mit samples verbunden sind, dann filtern wir die Fälle ohne samples raus,
        //ansonsten werden alle Kontaktfälle angezeigt die in den Graphen stecken
        // const graphCaseIds = graphCases.filter((graphCase) => graphCase.sample).map((caseData) => caseData.id);

        // Fall: 2: Hier werden alle Kontaktfälle angezeigt die in den Graphcase stecken, auch diese die nicht mit einem SampleFall verbunden sind
        const graphCaseIds = graphCases.map((caseData) => caseData.id);

        // graphcases enthält alle fälle, auch kontaktfälle die nach der filterung übrig geblieben sind
        // wir wollen nur Kontaktfälle anzeigen die in graphcases stecken
        let contactCases = [] as CaseWithRelationships[];
        for (const contactCase of allContactCases) {
            for (const contact of contacts) {
                if (contact.case_id_1 === contactCase.id && graphCaseIds.includes(contact.case_id_2)) {
                    contactCases.push(contactCase);
                }
                if (contact.case_id_2 === contactCase.id && graphCaseIds.includes(contact.case_id_1)) {
                    contactCases.push(contactCase);
                }
            }
        }

        contactCases = deleteDuplicateCases(contactCases);

        /* 
        // ---- test schleife siehe oben: gleiches ergebnis wie contactCases
        let newGraphCasesWithDirectConnections = [] as CaseWithRelationships[];
        for (const contactCase of contactCases) {
            for (const contact of contacts) {
                if (contact.case_id_1 === contactCase.id && graphCaseIds.includes(contact.case_id_2)) {
                    newGraphCasesWithDirectConnections.push(contactCase);
                }
                if (contact.case_id_2 === contactCase.id && graphCaseIds.includes(contact.case_id_1)) {
                    newGraphCasesWithDirectConnections.push(contactCase);
                }
            }
        }
        // jetzt kann man diese fälle in den graphcases hinzufügen und das vorgehen wiederholen (Rekursion?)
        // hier ein beispiel ohne rekursion mit zweiten cycle
        // -------------------------
        newGraphCasesWithDirectConnections = deleteDuplicateCases(newGraphCasesWithDirectConnections);
        console.log("newGraphCasesWithDirectConnections", newGraphCasesWithDirectConnections);
        console.log("graphCases before concat contactCases", graphCases);

        graphCases = graphCases.concat(newGraphCasesWithDirectConnections);
        console.log("graphCases after concat contactCases", graphCases);

        // zweiter Kontaktzyklus
        const graphCaseIdSecondcyle = graphCases.filter((graphCase) => graphCase.sample).map((caseData) => caseData.id);

        let secondCaseCycle = [] as CaseWithRelationships[];
        for (const contactCase of contactCases) {
            for (const contact of contacts) {
                if (contact.case_id_1 === contactCase.id && graphCaseIdSecondcyle.includes(contact.case_id_2)) {
                    secondCaseCycle.push(contactCase);
                }
                if (contact.case_id_2 === contactCase.id && graphCaseIdSecondcyle.includes(contact.case_id_1)) {
                    secondCaseCycle.push(contactCase);
                }
            }
        }
        secondCaseCycle = deleteDuplicateCases(secondCaseCycle);
        console.log("secondCaseCycle", secondCaseCycle);
        // hier endet der Testzyklus ---> Funktioniert noch nicht. Liegt vll daran das es solche fälle nicht gibt. Aber wer weiß
        // vll einfach mal alle kontaktfälle einblenden mit fliegen clustern siehe zeile 200-203  (cases ohne samples nicht mehr ausfiltern? )
        // -------------------------
 */
        // filter out cases without a samples
        graphCases = graphCases.filter((caseData) => caseData.sample);
        // add contact cases to the graph cases
        graphCases = graphCases.concat(contactCases);
    } else {
        // to calculate the mst with the genetic distance we have to filter out cases without a fasta_id
        graphCases = graphCases.filter((caseData) => caseData.sample);
    }

    // the graphCases array contains duplicated cases. Example: A case is in a selected
    // group and in background (not outbreak). The cases is added twice to the graphCases array.
    // to prevent rendering the same case multiple times we filter out duplicates in the end instead of
    // checking for duplicates in each filter step
    graphCases = deleteDuplicateCases(graphCases);

    return graphCases;
};

const createContactLinks = (graphCases: CaseWithRelationships[], contacts: ContactSchema[]) => {
    // const graphCasesWithoutContacts = graphCases.filter((caseData) => caseData.sample); // kontaktfälle erstmal rausfiltern
    const graphCasesIds: number[] = [];

    for (const caseData of graphCases) {
        //graphCases ersetzen mit grapjCasesWithoutContacts
        graphCasesIds.push(caseData.id);
    }

    const contactEdges: CustomLink[] = [];

    for (const contact of contacts) {
        if (contact.case_id_1 === contact.case_id_2) continue;
        // only add contact edges if both contact cases are in the already filtered graphCases array
        if (graphCasesIds.includes(contact.case_id_1) && graphCasesIds.includes(contact.case_id_2)) {
            const link = {
                source: contact.case_id_1,
                target: contact.case_id_2,
                value: "",
                type: "Dashed",
            } as CustomLink;
            contactEdges.push(link);
        }
    }

    return contactEdges;
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

            if (!rowCase.sample || !columnCase.sample) continue;
            graph.addEdge(
                new Edge(rowIndex, columnIndex, matrixDataAssembly[rowCase.sample.fasta_id][columnCase.sample.fasta_id])
            );
        }
    }

    // calculate edges that are in the mst by using kruskal's algorithm
    return graph.kruskal();
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
    let graphCases = await getGraphCases(cases, analysisSettings, contacts);

    // create a new graph object with the correct amount of nodes
    const graph = new Graph(graphCases.length);

    // calculate edges that are in the mst by using kruskal's algorithm
    const mstEdges = createMSTEdges(graphCases, matrixDataAssembly, graph);

    const groupToColor = getGroupToColor(cases, "outbreak_id");

    // create node objects for forced directed graph
    let nodes: CustomNode[] = graphCases.map((caseData) => {
        const outbreakName = caseData?.outbreak?.name || "Keinem Ausbruch zugewiesen";
        return {
            id: caseData.id,
            caseId: caseData.case_id,
            caseData: caseData,
            group: caseData.outbreak ? caseData.outbreak.name : "Keinem Ausbruch zugewiesen",
            color: groupToColor[outbreakName],
            registeredAt: caseData.registered_at.toLocaleDateString(),
        } satisfies CustomNode;
    });

    // create link objects for forced directed graph
    let links = mstEdges.map((edge) => {
        return {
            source: graphCases[edge.source].id,
            target: graphCases[edge.target].id,
            value: edge.weight.toString(),
            type: "Solid",
        };
    }) as CustomLink[];

    if (analysisSettings.showContactTracingEdges && contacts) {
        const contactTracingLinks = createContactLinks(graphCases, contacts);
        links = links.concat(contactTracingLinks);
    } else {
        nodes = nodes.filter((node) => node.caseData.sample);
    }

    return {
        nodes: nodes,
        links: links,
    };
};
