import { useGetOutbreakAnalysisById } from "@/modules/core/hooks/database/outbreakAnalyses/useGetOutbreakAnalysisById";
import { useEffect } from "react";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { useLocation } from "react-router-dom";

export const useSyncOutbreakAnalysisStoreWithDB = () => {
    const analysisId = decodeURI(useLocation().pathname.split("/")[2]);
    const outbreakAnalysisFromDB = useGetOutbreakAnalysisById(analysisId);
    const outbreakAnalysisStoreId = useOutbreakAnalysisStore((state) => state.id);
    const updateWholeAnalysis = useOutbreakAnalysisStore((state) => state.updateWholeAnalysis);

    //load outbreak analysis from indexedDB in zustand store
    return useEffect(() => {
        // skip sync if there is no entry in db or outbreakAnalysisStore is not initialized (happens on reload)
        // this allows to reload the graph is the page is reloaded
        if (!outbreakAnalysisFromDB || outbreakAnalysisStoreId) return;

        //override store with data from db
        const { id, name, analysisSettings, graphSettings, generalSettings } = outbreakAnalysisFromDB;
        updateWholeAnalysis(id, name, analysisSettings, graphSettings, generalSettings);
    }, [outbreakAnalysisFromDB?.id]);
};
