import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Box, Workflow } from "lucide-react";
import { useDashboard } from "@/providers/DashboardProvider";

export const DashboardSettings = () => {
  const dashboardContext = useDashboard();

  if (!dashboardContext) {
    // Handle the case where dashboardContext is null
    // This could be rendering a fallback UI or throwing an error
    return <div>Loading...</div>; // Example fallback UI
  }

  const changeNodeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    dashboardContext.updateSettings({ nodeSize: parseInt(event.target.value) });
  };

  const changelinkWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    dashboardContext.updateSettings({ linkWidth: parseInt(event.target.value) });
  };

  const changeGraphDimension = (selectValue: string) => {
    dashboardContext.updateSettings({ graphDimension: selectValue as "2D" | "3D" });
  };

  const changeZoomToFit = (checked: boolean) => {
    dashboardContext.updateSettings({ zoomToFit: checked });
  };

  const changeNodeStyle = (checked: boolean) => {
    dashboardContext.updateSettings({ showIdAsNode: checked });
  };

  return (
    <div className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Einstellungen</legend>
          <div className="grid gap-3">
            <Label htmlFor="model">Model</Label>
            <Select onValueChange={(value) => changeGraphDimension(value)}>
              <SelectTrigger id="model" className="items-start [&_[data-description]]:hidden">
                <SelectValue
                  placeholder="Wähle ein Model aus"
                  defaultValue={dashboardContext.settings.graphDimension}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2D">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Workflow className="size-5" />
                    <div className="grid gap-0.5">
                      <p>2D-Darstellung</p>
                      <p className="text-xs" data-description>
                        Zweidimensionale Darstellung des Graphen
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="3D">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Box className="size-5" />
                    <div className="grid gap-0.5">
                      <p>3D-Darstellung</p>
                      <p className="text-xs" data-description>
                        Dreidimensionale Darstellung des Graphen
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <Label htmlFor="nodeSize">Knotengröße</Label>
              <Input
                id="nodeSize"
                type="number"
                value={dashboardContext.settings.nodeSize}
                placeholder={`${dashboardContext.settings.nodeSize}`}
                onChange={(e) => changeNodeSize(e)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="linkWidth">Kantenbreite</Label>
              <Input
                id="linkWidth"
                type="number"
                value={dashboardContext.settings.linkWidth}
                placeholder={`${dashboardContext.settings.linkWidth}`}
                onChange={(e) => changelinkWidth(e)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="nodeDescription"
              checked={dashboardContext.settings.showIdAsNode}
              onCheckedChange={(value) => changeNodeStyle(Boolean(value))}
            />
            <label
              htmlFor="nodeDescription"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Knotenbeschreibung einblenden
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="zoomToFit"
              checked={dashboardContext.settings.zoomToFit}
              onCheckedChange={(value) => changeZoomToFit(Boolean(value))}
            />
            <label
              htmlFor="zoomToFit"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Zoom auf Fenstergröße aktivieren
            </label>
          </div>
        </fieldset>
        <fieldset className="grid gap-6 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">Legende</legend>
          <div className="flex flex-col gap-3">
            <Label htmlFor="role">Cluster</Label>
            <div className="flex items-center gap-2">
              <span className="rounded-full h-3 w-3 bg-green-500" />
              <p>Outbreak 1</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full h-3 w-3 bg-red-700" />
              <p>Background</p>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};
