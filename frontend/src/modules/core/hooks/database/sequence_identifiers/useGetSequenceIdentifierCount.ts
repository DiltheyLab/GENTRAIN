import { db } from "@/modules/core/services/database/DatabaseManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetSequenceIdentifierCount = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    return useLiveQuery(() => {
        if (!activePathogen) {
            return 0;
        }
        return db.sequence_identifiers.where({ pathogen_id: activePathogen.id }).count() ?? 0;
    }, [activePathogen]);
};
