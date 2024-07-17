import { DashboardGraphSettings } from "@/components/dashboard/DashboardGraphSettings";
import { DashboardVisualizationPanel } from "@/components/dashboard/DashboardVisualizationPanel";
import { DistanceMatrixTable } from "@/components/tables/DistanceMatrixTable";
import { SampleInformationTable } from "@/components/tables/SampleInformationTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "@/stores/app";

export function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            if (!useAppStore.getState().activePathogen) navigate("/data-upload");
        }, 50);
    }, []);

    return (
        <Layout>
            <div className="relative mx-auto p-4">
                <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <DashboardGraphSettings />
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <DashboardVisualizationPanel />
                    </div>
                </div>
                <div>
                    <Accordion type="multiple" className="mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Informationen zu den im Datensatz enthaltenen Fällen</AccordionTrigger>
                            <AccordionContent>
                                <SampleInformationTable />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Genetische Distanzen der im Datensatz enthaltenen Fälle</AccordionTrigger>
                            <AccordionContent>
                                <DistanceMatrixTable />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </Layout>
    );
}
