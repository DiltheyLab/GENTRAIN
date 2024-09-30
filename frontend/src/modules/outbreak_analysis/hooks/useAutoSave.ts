import { debounce } from "lodash";
import { useEffect, useCallback } from "react";
import { safeAnalysis } from "../helpers/safeAnalysis";
import { OutbreakAnalysisStore, useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";

export const useAutoSave = () => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore();

    useEffect(() => {
        if (!outbreakAnalysisStore.generalSettings.autoSave || !outbreakAnalysisStore.id) return;
        debouncedSafeAnalysis(outbreakAnalysisStore);
    }, [
        outbreakAnalysisStore.analysisSettings,
        outbreakAnalysisStore.graphSettings,
        outbreakAnalysisStore.generalSettings,
    ]);

    const debouncedSafeAnalysis = useCallback(
        debounce((outbreakAnalysisStore: OutbreakAnalysisStore) => safeAnalysis(outbreakAnalysisStore, false), 500),
        []
    );
};
