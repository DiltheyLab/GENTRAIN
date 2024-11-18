import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { CustomNode, CustomLink } from "@/modules/core/types/graph";
import { parseGermanDateFormat } from "./dates";
import i18next from "i18next";
import { CaseWithRelationships } from "@/modules/core/models/cases";

export const getSelectedClusters = () => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore.getState();
    let clusterNames = getUniqueClusters(outbreakAnalysisStore.graphData.nodes);
    clusterNames = moveNoOutbreakAssignedToEnd(clusterNames);
    const selectedOutbreak = clusterNames.filter(
        (clusterName) => clusterName === outbreakAnalysisStore.analysisSettings.selectedOutbreak?.name
    );
    const selectedBackground = clusterNames.filter(
        (clusterName) => clusterName !== outbreakAnalysisStore.analysisSettings.selectedOutbreak?.name
    );
    return { selectedOutbreak, selectedBackground };
};

export const moveNoOutbreakAssignedToEnd = (clusterNames: string[]) => {
    const clusterNamesCopy = [...clusterNames];
    //find the index of the cluster "Keinem Ausbruch zugewiesen" and put it at the end of the array
    const index = clusterNamesCopy.findIndex(
        (clusterName) => clusterName === i18next.t("clusterTypes.noOutbreakAssigned")
    );
    if (index !== -1) {
        const item = clusterNamesCopy.splice(index, 1);
        clusterNamesCopy.push(item[0]);
    }
    return clusterNamesCopy;
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

type LinkType = { type: string; color: string };
const getUniqueTypesOfLinks = (links: LinkType[]) => {
    return links
        .filter((link, index, self) => {
            return index === self.findIndex((l) => l.type === link.type);
        })
        .sort((a, b) => a.type.localeCompare(b.type));
};

export const categorizeLinks = (links: CustomLink[], geneticDistanceThreshold: number | undefined) => {
    const geneticDistanceLinksBelowThreshold: LinkType[] = [];
    const geneticDistanceLinksAboveThreshold: LinkType[] = [];
    const contactTracingLinks: LinkType[] = [];

    links.forEach((link) => {
        if (link.type === i18next.t(`linkTypes.geneticDistance`)) {
            if (geneticDistanceThreshold && link.value > geneticDistanceThreshold) {
                geneticDistanceLinksAboveThreshold.push({
                    type: `${link.type} > ${geneticDistanceThreshold}`,
                    color: link.color,
                });
            } else if (geneticDistanceThreshold && link.value <= geneticDistanceThreshold) {
                geneticDistanceLinksBelowThreshold.push({
                    type: `${link.type} ≤ ${geneticDistanceThreshold}`,
                    color: link.color,
                });
            } else {
                geneticDistanceLinksBelowThreshold.push({ type: link.type, color: link.color }); //fallback if geneticDistanceThreshold is undefined
            }
        } else {
            contactTracingLinks.push({ type: link.type, color: link.color });
        }
    });

    return {
        geneticDistanceLinksBelowThreshold: getUniqueTypesOfLinks(geneticDistanceLinksBelowThreshold),
        geneticDistanceLinksAboveThreshold: getUniqueTypesOfLinks(geneticDistanceLinksAboveThreshold),
        contactTracingLinks: getUniqueTypesOfLinks(contactTracingLinks),
    };
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

export const getUniqueClusterOfCases = (cases: CaseWithRelationships[]) => {
    // Extract unique cluster
    const cluster = cases.map((caseData) => {
        return caseData.outbreak ? caseData.outbreak.name : i18next.t("clusterTypes.noOutbreakAssigned");
    });
    return [...new Set(cluster)].sort();
};
