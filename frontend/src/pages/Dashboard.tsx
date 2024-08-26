import { DashboardSettings } from "@/components/dashboard/DashboardSettings";
import { DashboardVisualizationPanel } from "@/components/dashboard/DashboardVisualizationPanel";
import { DistanceMatrixTable } from "@/components/tables/DistanceMatrixTable";
import { SampleInformationTable } from "@/components/tables/SampleInformationTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";
import { useAppStore } from "@/stores/app";
import { useDashboardStore } from "@/stores/dashboard";
import { useEffect } from "react";

export function Dashboard() {
    const activePathogen = useAppStore().activePathogen;
    const updateSettings = useDashboardStore((state) => state.updateSettings);

    useEffect(() => {
        if (!activePathogen) return;
        updateSettings({
            clusteringThreshold: activePathogen?.genetic_distance_threshold ?? 0,
            geneticDistanceThreshold: activePathogen?.genetic_distance_threshold ?? 0,
        });
    }, [activePathogen]);

    return (
        <Layout>
            <div className="relative mx-auto p-4">
                <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <DashboardSettings />
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
