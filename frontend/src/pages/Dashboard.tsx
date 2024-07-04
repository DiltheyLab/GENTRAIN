import { Header } from "@/components/layout/Header";
import { DashboardGraphSettings } from "@/components/DashboardGraphSettings";
import { DashboardVisualizationPanel } from "@/components/DashboardVisualizationPanel";
import { GraphSettingsProvider } from "@/providers/GraphSettingsProvider";
import { DistanceMatrixTable } from "@/components/tables/DistanceMatrixTable";
import { SampleInformationTable } from "@/components/tables/SampleInformationTable";

export function Dashboard() {
    return (
        <GraphSettingsProvider>
            <Header /> {/* 👈 Es muss noch eine Layout Komponente angelegt und alle Seiten darin gewrappt werden */}
            <main className="relative mx-auto">
                <div className="flex p-4 flex-row">
                    <div className="w-1/2 md:w-1/3 lg:w-1/6 mr-4">
                        <DashboardGraphSettings />
                    </div>
                    <div className="w-1/2 md:w-2/3 lg:w-5/6">
                        <div>
                            <DashboardVisualizationPanel />
                        </div>
                        <div className="mt-4">
                            <DistanceMatrixTable />
                        </div>
                        <div className="mt-4">
                            <SampleInformationTable />
                        </div>
                    </div>
                </div>
            </main>
        </GraphSettingsProvider>
    );
}
