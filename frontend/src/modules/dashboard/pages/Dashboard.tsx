import { DashboardSettings } from "@/modules/dashboard/components/graph/Settings";
import { DashboardVisualizationPanel } from "@/modules/dashboard/components/graph/VisualizationPanel";
import { DistanceMatrixTable } from "@/modules/dashboard/components/distance_matrix/DistanceMatrixTable";
import { SampleInformationTable } from "@/modules/dashboard/components/information_table/SampleInformationTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/modules/core/components/ui/Accordion";
import { useDashboardStore } from "@/modules/dashboard/stores/dashboard";
import { useEffect } from "react";
import { useCoreStore } from "@/modules/core/stores/core";
import { Layout } from "@/modules/core/components/layout/Layout";

export function Dashboard() {
    const activePathogen = useCoreStore((state) => state.activePathogen);
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
