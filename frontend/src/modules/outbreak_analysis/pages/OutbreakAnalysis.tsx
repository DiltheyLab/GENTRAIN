import { Layout } from "@/modules/core/components/layout/Layout";
import { Settings } from "../components/settings/Settings";
import { VisualizationPanel } from "../components/graph/VisualizationPanel";

export const Analysis = () => {
    return (
        <Layout>
            <div className="relative mx-auto p-4">
                <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="w-full md:w-1/3 lg:w-1/4">
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
