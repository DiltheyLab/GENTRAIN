import { AnalysisSchema } from "@/modules/core/models/analyses";

export const validateAnalysisName = (analyses: AnalysisSchema[] | undefined, analysisName: string) => {
    const isUniqueName = () => {
        return analyses?.find((analysis) => analysis.name === analysisName) === undefined;
    };

    const nameLengthIsValid = () => {
        const maxAnalysisNameLength = 100;
        return analysisName.length > 0 && analysisName.length < maxAnalysisNameLength;
    };

    const analyseNameIsValid = () => {
        return nameLengthIsValid() && isUniqueName();
    };

    return { isUniqueName, nameLengthIsValid, analyseNameIsValid };
};
