import { CaseWithRelationships } from "@/database/cases";

export type CustomNode = {
    id: number;
    caseData: CaseWithRelationships;
    cluster: string;
    registeredAt: string;
};

export type CustomLink = {
    source: number;
    target: number;
    value: string;
    color: string;
    curvature: number;
    type: string;
    context: string;
};

export type GraphData = {
    nodes: CustomNode[];
    links: CustomLink[];
};

export type NodeColor = {
    color: string;
    isActive?: boolean;
};

export type ColorMap = {
    [cluster: string]: NodeColor;
};

export type ContactLinksColorMap = {
    [type: string]: string;
};

export type ColoringMode = "clusters" | "outbreaks" | "timeSpan";
