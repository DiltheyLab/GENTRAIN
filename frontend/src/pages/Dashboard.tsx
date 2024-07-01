import { Header } from "@/components/layout/Header";
import { DashboardSettings } from "@/components/DashboardSettings";
import { DashboardVisualizationPanel } from "@/components/DashboardVisualizationPanel";
import { DashboardProvider } from "@/providers/DashboardProvider";

export function Dashboard() {
  return (
    <DashboardProvider>
      <div className="flex flex-col">
        <Header /> {/* 👈 Es muss noch eine Layout Komponente angelegt und alle Seiten darin gewrappt werden */}
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardSettings />
          <DashboardVisualizationPanel />
        </main>
      </div>
    </DashboardProvider>
  );
}
