import { GroupSchema } from "@/modules/core/models/groups";

export const validateGroupName = (groups: GroupSchema[] | undefined, groupName: string) => {
    const isUniqueName = () => {
        return groups?.find((group) => group.name === groupName) === undefined;
    };

    const nameLengthIsValid = () => {
        const maxNameLength = 100;
        return groupName.length > 0 && groupName.length < maxNameLength;
    };

    const groupNameNotValid = () => {
        return nameLengthIsValid() && isUniqueName();
    };

    return { isUniqueName, nameLengthIsValid, groupNameNotValid };
};
