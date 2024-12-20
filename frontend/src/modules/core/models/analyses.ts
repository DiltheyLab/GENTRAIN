import { AnalysisSettings, GeneralSettings, GraphSettings } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { getOutbreakMapForPathogenId } from "./outbreaks";
import { GroupWithCategory } from "./groups";
import { getCategoriesForActivePathogen } from "./categories";

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
        if (analysis.analysisSettings.selectedBackground) {
            const groupIds =
                analysis.analysisSettings.selectedBackground.groupsWithCategories.map((group) => group.id) ?? [];
            const groups = await db.groups.where("id").anyOf(groupIds).toArray();
            const categories = await getCategoriesForActivePathogen();
            const groupWithCategory = groups.map((group) => {
                return { ...group, categoryName: categories.get(group.category_id)?.name } as GroupWithCategory;
            });
            analysis.analysisSettings.selectedBackground.groupsWithCategories = groupWithCategory;
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
