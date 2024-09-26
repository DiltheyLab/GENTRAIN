import { Layout } from "@/modules/core/components/layout/Layout";
import { Settings } from "../components/settings/Settings";
import { VisualizationPanel } from "../components/graph/VisualizationPanel";
import { useEffect, useRef } from "react";
import { useCoreStore } from "@/modules/core/stores/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetAnalysisById } from "@/modules/core/hooks/database/analyses/useGetAnalysisById";
import { useOutbreakAnalysisStore } from "../stores/outbreakAnalysis";

export const Analysis = () => {
    const activePathogen = useCoreStore((state) => state.activePathogen);
    const navigate = useNavigate();
    const prevActivePathogenRef = useRef(activePathogen);
    const analysisId = decodeURI(useLocation().pathname.split("/")[2]);
    const outbreakAnalysis = useGetAnalysisById(analysisId);
    const updateAll = useOutbreakAnalysisStore((state) => state.updateWholeAnalysis);

    useEffect(() => {
        //load analysis from indexedDB in zustand store
        if (!outbreakAnalysis) return;
        const { id, name, settings, graphSettings } = outbreakAnalysis;
        updateAll(id, name, settings, graphSettings);
    }, [outbreakAnalysis?.id]);

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
