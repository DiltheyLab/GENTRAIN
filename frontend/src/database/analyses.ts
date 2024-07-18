import { AnalysisSettings } from "@/stores/analysis";
import { db } from "./db";
export interface AnalysisSchema {
    id: number;
    name: string;
    settings: AnalysisSettings;
    created_at?: Date;
    updated_at?: Date;
}

export const getAllAnalyses = () => {
    return db.analyses.toArray();
};

export const createAnalysis = async (name: string, settings: AnalysisSettings) => {
    const analysis = {
        name: name,
        settings: settings,
    };
    return await db.analyses.add(analysis);
};

export const getAnalysisByID = (id: number) => {
    return db.analyses.get(id);
};

export const updateAnalysisSettings = async (id: number, settings: AnalysisSettings) => {
    return await db.analyses.update(id, { settings: settings });
};
