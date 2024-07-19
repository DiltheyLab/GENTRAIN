import { Layout } from "@/components/layout/Layout";
import { Analysis } from "@/components/outbreakAnalysis/Analysis";
import { AnalysisDialog } from "@/components/outbreakAnalysis/AnalysisDialog";
import { useState } from "react";

export const OutbreakAnalysis = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    return <Layout>{isOpen ? <AnalysisDialog isOpen changeIsOpen={handleOpen} /> : <Analysis />}</Layout>;
};
