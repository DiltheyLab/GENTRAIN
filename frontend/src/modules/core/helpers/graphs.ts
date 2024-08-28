import { CaseWithRelationships } from "@/database/cases";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { CustomNode, CustomLink, ColorMap } from "@/modules/core/types/graph";
import { OutbreakSchema } from "@/database/outbreaks";
import {
    COLOR_FOR_CASES_WITHOUT_CLUSTERS,
    COLOR_FOR_SELECTED_OUTBREAK,
    COLOR_PALETTE_NODES,
} from "@/modules/core/helpers/colors/colorPalettes";
import { parseGermanDateFormat } from "./dates";
import i18next from "i18next";

export const getSelectedClusters = () => {
    const analysisStore = useOutbreakAnalysisStore.getState();
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
