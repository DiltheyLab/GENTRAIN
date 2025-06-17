import { SequenceAnalysisSchema } from "@/modules/core/models/sequence_analyses";
import { db } from "@/modules/core/services/database/DatabaseManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLiveQuery } from "dexie-react-hooks";

export const useGetSequenceAnalysesWithoutResultCount = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    return useLiveQuery(() => {
        if (!activePathogen) {
            return 0;
        }
        return (
            db.sequence_analyses
                .where({ pathogen_id: activePathogen.id })
                .filter((sequenceAnalysis: SequenceAnalysisSchema) => !sequenceAnalysis.result)
                .count() ?? 0
        );
    }, [activePathogen]);
};
