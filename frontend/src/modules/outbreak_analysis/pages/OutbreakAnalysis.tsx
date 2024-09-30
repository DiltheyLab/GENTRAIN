import { Layout } from "@/modules/core/components/layout/Layout";
import { Settings } from "../components/settings/Settings";
import { VisualizationPanel } from "../components/graph/VisualizationPanel";
import { useEffect, useRef } from "react";
import { useCoreStore } from "@/modules/core/stores/core";
import { useNavigate } from "react-router-dom";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";
import { safeAnalysis } from "../helpers/safeAnalysis";
import { useSyncOutbreakAnalysisStoreWithDB } from "../hooks/useSyncOutbreakAnalysisStoreWithDB";

export const OutbreakAnalysis = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const navigate = useNavigate();
    const prevActivePathogenRef = useRef(activePathogen);
    const outbreakAnalysisStore = useOutbreakAnalysisStore();

    useSyncOutbreakAnalysisStoreWithDB();

    useEffect(() => {
        if (!outbreakAnalysisStore.generalSettings.autoSave || !outbreakAnalysisStore.id) return;

        safeAnalysis(outbreakAnalysisStore, false);
    }, [
        outbreakAnalysisStore.analysisSettings,
        outbreakAnalysisStore.graphSettings,
        outbreakAnalysisStore.generalSettings,
    ]);

    useEffect(() => {
        // If the active pathogen changes, navigate to the outbreak analysis page
        if (prevActivePathogenRef.current && prevActivePathogenRef.current.id !== activePathogen?.id) {
            navigate("/outbreak-analysis");
        }
        prevActivePathogenRef.current = activePathogen;
    }, [activePathogen]);

    return (
        <Layout>
            <div className="relative mx-auto p-4">
                <div className="flex flex-col-reverse gap-4 md:flex-row h-[85vh]">
                    <div className="w-full md:w-1/3 lg:w-1/4 ">
                        <Settings />
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <VisualizationPanel />
                    </div>
                </div>
            </div>
        </Layout>
    );
};
