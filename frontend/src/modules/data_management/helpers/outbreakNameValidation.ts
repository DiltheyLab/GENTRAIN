import { OutbreakSchema } from "@/modules/core/models/outbreaks";

export const validateOutbreakName = (outbreaks: OutbreakSchema[] | undefined, outbreakName: string) => {
    const isUniqueName = () => {
        return outbreaks?.find((analysis) => analysis.name === outbreakName) === undefined;
    };

    const nameLengthIsValid = () => {
        const maxAnalysisNameLength = 100;
        return outbreakName.length > 0 && outbreakName.length < maxAnalysisNameLength;
    };

    const outbreakNameNotValid = () => {
        return nameLengthIsValid() && isUniqueName();
    };

    return { isUniqueName, nameLengthIsValid, outbreakNameNotValid };
};
