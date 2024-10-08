import { Footer } from "@/modules/core/components/layout/Footer";
import { Header } from "@/modules/core/components/layout/Header";
import { SampleUploadStatus } from "@/modules/data_management/components/sample_upload_status/SampleUploadStatus";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export const Layout = ({ children }: any) => {
    const hideSampleUploadContent = useDataManagementStore((state) => state.hideSampleUploadContent);
    const sequenceAnalysisRunning = useDataManagementStore((state) => state.sequenceAnalysisRunning);
    const distanceCalculationRunning = useDataManagementStore((state) => state.distanceCalculationRunning);
    return (
        <div>
            <Header />
            <main className="max-w-[1500px] mx-auto min-h-[calc(100vh-185px)]">{children}</main>
            {(sequenceAnalysisRunning || distanceCalculationRunning) && (
                <div className="relative z-50">
                    <div
                        className={`fixed bottom-0 right-0 p-8 ${
                            hideSampleUploadContent ? "w-auto" : "w-full md:w-2/3 lg:w-1/2"
                        }`}
                    >
                        <SampleUploadStatus />
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};
