import { useEffect, useRef } from "react";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { useGetSequenceAnalysesWithoutResultCount } from "@/modules/core/hooks/database/sequence_identifiers/useGetSequenceIdentifierCount";

export const useHandlePersistedSequenceAnalysisResults = () => {
    const sessionId = useCoreStore((state) => state.sessionId);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const effectRan = useRef(false);
    const sequenceAnalysesWithoutResultCount = useGetSequenceAnalysesWithoutResultCount();
    const getStrategyAndHandlePersistedResults = async () => {
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
        sequenceAnalysisStrategy?.handlePersistedResults();
    };
    useEffect(() => {
        if (
            sessionId &&
            activePathogen &&
            sequenceAnalysesWithoutResultCount &&
            sequenceAnalysesWithoutResultCount > 0
        ) {
            if (!effectRan.current) {
                getStrategyAndHandlePersistedResults();
            }
            effectRan.current = true;
        }
    }, [sessionId, activePathogen, sequenceAnalysesWithoutResultCount]);
};
