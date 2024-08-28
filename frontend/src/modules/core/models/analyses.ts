import { AnalysisSettings, GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { db } from "@/core/infrastructure/database";

export interface AnalysisSchema {
    id: number;
    name: string;
    settings: AnalysisSettings;
    graphSettings: GraphSettings;
    pathogen_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export const getAllAnalyses = () => {
    return db.analyses.toArray();
};

export const getAnalysesForPathogenId = async (pathogenId: number) => {
    const analyses = await db.analyses.where({ pathogen_id: pathogenId }).toArray();
    return analyses;
};

export const createAnalysis = async (
    name: string,
    pathogen_id: number,
    settings: AnalysisSettings,
    graphSettings: GraphSettings
) => {
    const analysis = {
        name: name,
        settings: settings,
        graphSettings: graphSettings,
        pathogen_id: pathogen_id,
    };
    return await db.analyses.add(analysis);
};

export const getAnalysisByID = (id: number) => {
    return db.analyses.get(id);
};

export const updateAnalysisSettings = async (id: number, settings: AnalysisSettings, graphSettings: GraphSettings) => {
    return await db.analyses.update(id, { settings: settings, graphSettings: graphSettings });
};

export const deleteAnalysesByPathogenId = async (pathogen_id: number) => {
    await db.analyses.where({ pathogen_id: pathogen_id }).delete();
};
