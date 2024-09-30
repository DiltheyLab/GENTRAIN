import { AnalysisSettings, GeneralSettings, GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { db } from "@/modules/core/infrastructure/database";

export interface AnalysisSchema {
    id: number;
    name: string;
    analysisSettings: AnalysisSettings;
    graphSettings: GraphSettings;
    generalSettings: GeneralSettings;
    pathogen_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export const getAllAnalyses = () => {
    return db.analyses.toArray();
};

export const getAnalysesForPathogenId = async (pathogenId: number) => {
    return await db.analyses.where({ pathogen_id: pathogenId }).toArray();
};

export const createAnalysis = async (
    name: string,
    pathogen_id: number,
    analysisSettings: AnalysisSettings,
    graphSettings: GraphSettings,
    generalSettings: GeneralSettings
) => {
    const analysis = {
        name: name,
        analysisSettings: analysisSettings,
        graphSettings: graphSettings,
        generalSettings: generalSettings,
        pathogen_id: pathogen_id,
    };
    return await db.analyses.add(analysis);
};

export const getAnalysisByID = (id: number) => {
    return db.analyses.get(id);
};

export const updateAnalysisSettings = async (
    id: number,
    analysisSettings: AnalysisSettings,
    graphSettings: GraphSettings,
    generalSettings: GeneralSettings
) => {
    return await db.analyses.update(id, {
        analysisSettings: analysisSettings,
        graphSettings: graphSettings,
        generalSettings: generalSettings,
    });
};

export const deleteAnalysesByPathogenId = async (pathogen_id: number) => {
    await db.analyses.where({ pathogen_id: pathogen_id }).delete();
};
