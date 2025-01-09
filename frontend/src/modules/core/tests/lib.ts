import { PathogenTypeName, PathogenTypeSchema } from "../models/pathogen_types";
import { PathogenSchema } from "../models/pathogens";
import { useCoreStore } from "../stores/core";

export const activatePathogenType = (type: PathogenTypeName) => {
    useCoreStore.setState({
        activePathogen: {
            pathogen_type: { name: type } as PathogenTypeSchema,
        } as unknown as PathogenSchema,
    });
};
