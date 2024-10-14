import { AnalysisSettings, GeneralSettings, GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { db } from "@/modules/core/infrastructure/database";
import { getOutbreakMapForPathogenId } from "./outbreaks";

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
    const analyses = await db.analyses.where({ pathogen_id: pathogenId }).toArray();
    const outbreakMap = await getOutbreakMapForPathogenId(pathogenId);
    for (const analysis of analyses) {
        if (analysis.analysisSettings.selectedOutbreak?.id) {
            analysis.analysisSettings.selectedOutbreak =
                outbreakMap.get(analysis.analysisSettings.selectedOutbreak?.id) ?? null;
        }
    }
    return analyses;
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

export const getAnalysisByID = async (id: number) => {
    const analysis = await db.analyses.get(id);
    if (analysis?.analysisSettings.selectedOutbreak?.id) {
        analysis.analysisSettings.selectedOutbreak =
            (await db.outbreaks.get(analysis.analysisSettings.selectedOutbreak.id)) ?? null;
    }
    return analysis;
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

export const updateAnalysisName = async (id: number, name: string) => {
    return await db.analyses.update(id, {
        name: name,
    });
};

export const deleteAnalysesByPathogenId = async (pathogen_id: number) => {
    await db.analyses.where({ pathogen_id: pathogen_id }).delete();
};
