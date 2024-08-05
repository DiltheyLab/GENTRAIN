import { CaseWithRelationships } from "@/database/cases";

export type CustomNode = {
    id: number;
    caseId: string;
    caseData: CaseWithRelationships;
    cluster: string;
    color: string;
    registeredAt?: string;
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
