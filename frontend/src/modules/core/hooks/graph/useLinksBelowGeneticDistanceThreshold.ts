import { useRef } from "react";
import { CustomLink, CustomNode } from "../../types/graph";

export const useLinksBelowGeneticDistanceThreshold = (
    geneticDistanceThreshold: number,
    selectedNode: CustomNode | null
) => {
    const allLinksRef = useRef<CustomLink[] | undefined>(undefined);

    const setAllLinks = (allLinks: CustomLink[]) => {
        allLinksRef.current = allLinks;
    };

    if (!selectedNode) {
        return [[] as CustomLink[], setAllLinks] as const;
    }

    const geneticDistanceFilteredLinks =
        allLinksRef.current?.filter(
            (link) =>
                link.value <= geneticDistanceThreshold &&
                (link.source === selectedNode.id || link.target === selectedNode.id)
        ) ?? [];

    return [geneticDistanceFilteredLinks, setAllLinks] as const;
};
