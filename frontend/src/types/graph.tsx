export type CustomNode = {
    id: number;
    caseId: string;
    group: string;
    color: string;
    registeredAt?: string;
};

export type LinkType = "ArrowToTarget" | "ArrowToSource" | "ArrowBidirectional" | "Dashed" | "Solid";

export type CustomLink = {
    source: number;
    target: number;
    value: number;
    type: LinkType;
};

export type GraphData = {
    nodes: CustomNode[];
    links: CustomLink[];
};
