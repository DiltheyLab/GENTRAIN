import { OutbreakSchema } from "@/modules/core/models/outbreaks";

export const validateOutbreakName = (outbreaks: OutbreakSchema[] | undefined, outbreakName: string) => {
    const isUniqueName = () => {
        return outbreaks?.find((outbreak) => outbreak.name === outbreakName) === undefined;
    };

    const nameLengthIsValid = () => {
        const maxNameLength = 100;
        return outbreakName.length > 0 && outbreakName.length < maxNameLength;
    };

    const outbreakNameNotValid = () => {
        return nameLengthIsValid() && isUniqueName();
    };

    return { isUniqueName, nameLengthIsValid, outbreakNameNotValid };
};
