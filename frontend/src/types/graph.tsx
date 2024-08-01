import { CaseWithRelationships } from "@/database/cases";

export type CustomNode = {
    id: number;
    caseId: string;
    caseData: CaseWithRelationships;
    group: string;
    color: string;
    registeredAt?: string;
};

export type LinkType = "ArrowToTarget" | "ArrowToSource" | "ArrowBidirectional" | "Dashed" | "Solid";

export type CustomLink = {
    source: number;
    target: number;
    value: string;
    type: LinkType;
};

export type GraphData = {
    nodes: CustomNode[];
    links: CustomLink[];
};
