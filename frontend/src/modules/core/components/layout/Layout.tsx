import { Footer } from "@/modules/core/components/layout/Footer";
import { Header } from "@/modules/core/components/layout/Header";
import { SequenceAnalysisOverlay } from "@/modules/data_management/components/sequence_analysis/SequenceAnalysisOverlay";

export const Layout = ({ children }: any) => {
    return (
        <div>
            <Header />
            <main className="max-w-[1500px] mx-auto min-h-[calc(100vh-185px)]">{children}</main>
            <SequenceAnalysisOverlay />
            <Footer />
        </div>
    );
};
