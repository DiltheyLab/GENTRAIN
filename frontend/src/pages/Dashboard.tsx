import { DashboardGraphSettings } from "@/components/DashboardGraphSettings";
import { DashboardVisualizationPanel } from "@/components/DashboardVisualizationPanel";
import { GraphSettingsProvider } from "@/providers/GraphSettingsProvider";
import { DistanceMatrixTable } from "@/components/tables/DistanceMatrixTable";
import { SampleInformationTable } from "@/components/tables/SampleInformationTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Layout } from "@/components/layout/Layout";

export function Dashboard() {
    return (
        <Layout>
            <GraphSettingsProvider>
                <div className="relative max-w-[1500px] mx-auto p-4">
                    <div className="flex flex-row">
                        <div className="w-1/2 md:w-1/3 lg:w-1/4 mr-4">
                            <DashboardGraphSettings />
                        </div>
                        <div className="w-1/2 md:w-2/3 lg:w-3/4">
                            <DashboardVisualizationPanel />
                        </div>
                    </div>
                    <div>
                        <Accordion type="multiple" className="mt-4">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    Informationen zu den im Datensatz enthaltenen Fällen
                                </AccordionTrigger>
                                <AccordionContent>
                                    <SampleInformationTable />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>
                                    Genetische Distanzen der im Datensatz enthaltenen Fälle
                                </AccordionTrigger>
                                <AccordionContent>
                                    <DistanceMatrixTable />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </GraphSettingsProvider>
        </Layout>
    );
}
