import { Footer } from "@/modules/core/components/layout/Footer";
import { Header } from "@/modules/core/components/layout/Header";
import { SampleUploadStatus } from "@/modules/data_management/components/upload_section/SampleUploadStatus";
import { useDataManagementStore } from "@/modules/data_management/stores/dataManagement";

export const Layout = ({ children }: any) => {
    const showSampleUploadStatus = useDataManagementStore((state) => state.showSampleUploadStatus);

    return (
        <div>
            <Header></Header>
            <main className="max-w-[1500px] mx-auto min-h-[calc(100vh-185px)]">{children}</main>
            <div className="relative z-50">
                <div className="fixed bottom-0 right-0 w-3/12 lg:w-4/12 mb-8 mr-8">
                    {showSampleUploadStatus && <SampleUploadStatus />}
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};
