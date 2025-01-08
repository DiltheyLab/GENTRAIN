import { useGetOutbreakAnalysisById } from "@/modules/core/hooks/database/outbreakAnalyses/useGetOutbreakAnalysisById";
import { useEffect } from "react";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { useLocation } from "react-router-dom";

export const useSyncOutbreakAnalysisStoreWithDB = () => {
    const analysisId = decodeURI(useLocation().pathname.split("/")[2]);
    const outbreakAnalysisFromDB = useGetOutbreakAnalysisById(analysisId);
    const updateWholeAnalysis = useOutbreakAnalysisStore((state) => state.updateWholeAnalysis);

    //load outbreak analysis from indexedDB in zustand store
    return useEffect(() => {
        // skip sync if there is no entry in db
        if (!outbreakAnalysisFromDB) return;
        //override store with data from db
        const { id, name, analysisSettings, graphSettings, generalSettings } = outbreakAnalysisFromDB;
        updateWholeAnalysis(id, name, analysisSettings, graphSettings, generalSettings);
    }, [outbreakAnalysisFromDB?.id]);
};
