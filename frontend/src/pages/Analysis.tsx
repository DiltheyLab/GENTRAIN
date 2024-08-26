import { Layout } from "../components/layout/Layout";
import { AnalysisSettings } from "../components/outbreakAnalysis/AnalysisSettings";
import { AnalysisVisualizationPanel } from "../components/outbreakAnalysis/AnalysisVisualizationPanel";

export const Analysis = () => {
    return (
        <Layout>
            <div className="relative mx-auto p-4">
                <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <AnalysisSettings />
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <AnalysisVisualizationPanel />
                    </div>
                </div>
            </div>
        </Layout>
    );
};
