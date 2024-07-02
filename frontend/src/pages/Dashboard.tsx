import { Header } from "@/components/layout/Header";
import { DashboardGraphSettings } from "@/components/DashboardGraphSettings";
import { DashboardVisualizationPanel } from "@/components/DashboardVisualizationPanel";
import { GraphSettingsProvider } from "@/providers/GraphSettingsProvider";

export function Dashboard() {
  return (
    <GraphSettingsProvider>
      <div className="flex flex-col">
        <Header /> {/* 👈 Es muss noch eine Layout Komponente angelegt und alle Seiten darin gewrappt werden */}
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardGraphSettings />
          <DashboardVisualizationPanel />
        </main>
      </div>
    </GraphSettingsProvider>
  );
}
