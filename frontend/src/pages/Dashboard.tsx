import { Header } from "@/components/layout/Header";
import { DashboardGraphSettings } from "@/components/DashboardGraphSettings";
import { DashboardVisualizationPanel } from "@/components/DashboardVisualizationPanel";
import { GraphSettingsProvider } from "@/providers/GraphSettingsProvider";
import { DistanceMatrixTable } from "@/components/tables/DistanceMatrixTable";
import { SampleInformationTable } from "@/components/tables/SampleInformationTable";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Dashboard() {
    return (
        <GraphSettingsProvider>
            <Header /> {/* 👈 Es muss noch eine Layout Komponente angelegt und alle Seiten darin gewrappt werden */}
            <main className="relative max-w-[1500px] mx-auto p-4">
                <div className="flex flex-row">
                    <div className="w-1/2 md:w-1/3 lg:w-1/6 mr-4">
                        <DashboardGraphSettings />
                    </div>
                    <div className="w-1/2 md:w-2/3 lg:w-5/6">
                        <DashboardVisualizationPanel />
                    </div>
                </div>
                <div>
                    <Accordion type="multiple" className="w-full">
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
            </main>
        </GraphSettingsProvider>
    );
}
