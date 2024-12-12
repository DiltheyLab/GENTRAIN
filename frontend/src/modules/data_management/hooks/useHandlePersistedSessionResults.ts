import { useEffect, useRef } from "react";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { useGetSequenceIdentifierCount } from "@/modules/core/hooks/database/sequence_identifiers/useGetSequenceIdentifierCount";

export const useHandlePersistedSessionResults = () => {
    const sessionId = useCoreStore((state) => state.sessionId);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const effectRan = useRef(false);
    const sequenceIdentifierCount = useGetSequenceIdentifierCount();
    const getStrategyAndHandlePersistedResults = async () => {
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
        sequenceAnalysisStrategy?.handlePersistedResults();
    };
    useEffect(() => {
        if (sessionId && activePathogen && sequenceIdentifierCount && sequenceIdentifierCount > 0) {
            if (!effectRan.current) {
                getStrategyAndHandlePersistedResults();
            }
            effectRan.current = true;
        }
    }, [sessionId, activePathogen, sequenceIdentifierCount]);
};
