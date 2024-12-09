import { useEffect, useRef } from "react";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { useGetSequenceIdentifierCount } from "@/modules/core/hooks/database/sequence_identifiers/useGetSequenceIdentifierCount";

export const useHandlePersistedSessionResults = () => {
    const session = useCoreStore((state) => state.session);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const sequenceIdentifierCount = useGetSequenceIdentifierCount();
    const effectRan = useRef(false);
    const getStrategyAndHandlePersistedResults = async () => {
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
        sequenceAnalysisStrategy?.handlePersistedResults();
    };
    useEffect(() => {
        if (session && activePathogen && sequenceIdentifierCount > 0) {
            if (!effectRan.current) {
                getStrategyAndHandlePersistedResults();
            }
            effectRan.current = true;
        }
    }, [session, activePathogen]);
};
