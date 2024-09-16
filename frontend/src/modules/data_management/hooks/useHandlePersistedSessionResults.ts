import { useEffect, useRef } from "react";
import { PathogenStrategyManager } from "@/modules/data_management/services/pathogen_strategies/PathogenStrategyManager";
import { useCoreStore } from "@/modules/core/stores/core";
import { socket } from "@/modules/core/helpers/socket";

export const useHandlePersistedSessionResults = () => {
    const session = useCoreStore((state) => state.session);
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const effectRan = useRef(false);
    const getStrategyAndHandlePersistedResults = async () => {
        const sequenceAnalysisStrategy = await PathogenStrategyManager.getSequenceAnalysisStrategy();
        sequenceAnalysisStrategy?.handlePersistedResults();
    };
    useEffect(() => {
        if (session && socket && activePathogen) {
            if (!effectRan.current) {
                getStrategyAndHandlePersistedResults();
            }
            effectRan.current = true;
        }
    }, [session, socket, activePathogen]);
};
