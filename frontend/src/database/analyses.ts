import { analysisSettings } from "@/stores/analysis";
import { z } from "zod";
import { db } from "./db";

export interface AnalysisSchema {
    id: number;
    name: string;
    config: analysisSettings;
    created_at?: Date;
    updated_at?: Date;
}

export const analysisRules = z.object({
    name: z.string().min(1),
    sample_id: z.string().min(1).or(z.null()),
    config: z.object({
        nodeSize: z.number(),
        linkWidth: z.number(),
        zoomToFit: z.boolean(),
        charge: z.number(),
        linkDistance: z.number(),
    }),
});

export const getAllAnalyses = () => {
    return db.analyses.toArray();
};
