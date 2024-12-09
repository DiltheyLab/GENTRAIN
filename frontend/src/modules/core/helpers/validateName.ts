import { AnalysisSchema } from "@/modules/core/models/analyses";
import { OutbreakSchema } from "@/modules/core/models/outbreaks";

export const validateName = (entities: AnalysisSchema[] | OutbreakSchema[] | undefined, name: string) => {
    const isUniqueName = () => {
        return entities?.find((entity) => entity.name === name) === undefined;
    };

    const nameLengthIsValid = () => {
        const maxNameLength = 100;
        return name.length > 0 && name.length < maxNameLength;
    };

    const isNameValid = () => {
        return nameLengthIsValid() && isUniqueName();
    };

    return { isUniqueName, nameLengthIsValid, isNameValid };
};
