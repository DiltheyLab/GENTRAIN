import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Box, Workflow } from "lucide-react";
import { useGraphSettings } from "@/providers/GraphSettingsProvider";
import { Slider } from "@/components/ui/slider";
import { Button } from "./ui/button";
import type { Coloring, Filter } from "@/providers/GraphSettingsProvider";
import { useSamplesGetAll } from "@/database/samples";
import { getGroupToColor } from "@/services/graphs";

export const DashboardGraphSettings = () => {
    const graphSettingsContext = useGraphSettings();
    const samples = useSamplesGetAll();

    if (!graphSettingsContext) {
        // Handle the case where graphSettingsContext is null
        // This could be rendering a fallback UI or throwing an error
        return <div>Loading...</div>; // Example fallback UI
    }

    const changeNodeSize = (value: number) => {
        graphSettingsContext.updateSettings({
            nodeSize: value,
        });
    };

    const changeLinkWidth = (value: number) => {
        graphSettingsContext.updateSettings({
            linkWidth: value,
        });
    };

    const changeCharge = (value: number) => {
        graphSettingsContext.updateSettings({ charge: value });
    };

    const changeLinkDistance = (value: number) => {
        graphSettingsContext.updateSettings({ linkDistance: value });
    };

    const changeGraphDimension = (selectValue: string) => {
        graphSettingsContext.updateSettings({
            graphDimension: selectValue as "2D" | "3D",
        });
    };

    const changeZoomToFit = (checked: boolean) => {
        graphSettingsContext.updateSettings({ zoomToFit: checked });
    };

    const changeNodeStyle = (checked: boolean) => {
        graphSettingsContext.updateSettings({ hideNodeLabel: checked });
    };

    const changeFilter = (filter: Filter) => {
        graphSettingsContext.updateSettings({ filter: filter });
    };

    const changeColoring = (coloring: Coloring) => {
        graphSettingsContext.updateSettings({ coloring: coloring });
        const graphData = graphSettingsContext.settings.graphData;

        if (!samples) return;

        const groupToColorNormal = getGroupToColor(samples, "group");
        const groupToColorSamplingTime = getGroupToColor(samples, "sampled_at");

        const coloredNodes = graphData.nodes.map((node) => {
            let color = node.color;
            if (coloring === "normal") {
                color = groupToColorNormal[node.group]; // if coloring is normal, color it by group
            } else if (coloring === "outbreaks" && node.group === "background") {
                color = "#D3D2D2"; // if node is background, color it grey
            } else if (coloring === "sampled_at" && node.sampledAt) {
                color = groupToColorSamplingTime[node.sampledAt]; // if coloring is sampled_at, color it by sampling time
            }

            return { ...node, color };
        });

        graphSettingsContext.updateSettings({
            graphData: {
                nodes: coloredNodes,
                links: graphData.links,
            },
        });
    };

    return (
        <div className="relative flex-col items-center gap-8 flex" x-chunk="dashboard-03-chunk-0">
            <form className="grid w-full items-start gap-3">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Einstellungen</legend>
                    <div className="grid gap-3">
                        <Label htmlFor="model">Model</Label>
                        <Select onValueChange={(value) => changeGraphDimension(value)}>
                            <SelectTrigger id="model" className="items-start [&_[data-description]]:hidden">
                                <SelectValue
                                    placeholder="Wähle ein Model aus"
                                    defaultValue={graphSettingsContext.settings.graphDimension}
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

                    <div className="grid gap-3">
                        <Label htmlFor="nodeSize">Knotengröße</Label>
                        <Slider
                            id="nodeSize"
                            defaultValue={[5]}
                            max={10}
                            min={1}
                            step={1}
                            onValueChange={(value) => changeNodeSize(value[0])}
                        />
                        <Label htmlFor="linkWidth">Kantenbreite</Label>
                        <Slider
                            id="linkWidth"
                            defaultValue={[2.5]}
                            max={5}
                            min={0}
                            step={1}
                            onValueChange={(value) => changeLinkWidth(value[0])}
                        />
                        <Label htmlFor="forceLinkDistance">Kantenabstand</Label>
                        <Slider
                            id="forceLinkDistance"
                            defaultValue={[graphSettingsContext.settings.linkDistance]}
                            max={100}
                            min={10}
                            step={1}
                            onValueChange={(value) => changeLinkDistance(value[0])}
                        />
                        <Label htmlFor="forceCharge">Anziehungskraft</Label>
                        <Slider
                            id="forceCharge"
                            defaultValue={[graphSettingsContext.settings.charge]}
                            max={0}
                            min={-100}
                            step={1}
                            onValueChange={(value) => changeCharge(value[0])}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="nodeDescription"
                            checked={graphSettingsContext.settings.hideNodeLabel}
                            onCheckedChange={(value) => changeNodeStyle(Boolean(value))}
                        />
                        <label
                            htmlFor="nodeDescription"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Knotenbeschreibung ausblenden
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="zoomToFit"
                            checked={graphSettingsContext.settings.zoomToFit}
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
                    <legend className="-ml-1 px-1 text-sm font-medium">Filter</legend>
                    <div className="flex flex-row gap-3">
                        <Button
                            type="button"
                            variant={graphSettingsContext.settings.filter === "all" ? "default" : "secondary"}
                            className="w-1/2"
                            onClick={() => changeFilter("all")}
                        >
                            Alle
                        </Button>
                        <Button
                            type="button"
                            variant={graphSettingsContext.settings.filter === "outbreaks" ? "default" : "secondary"}
                            className="w-1/2"
                            onClick={() => changeFilter("outbreaks")}
                        >
                            Outbreaks
                        </Button>
                    </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Einfärbung</legend>
                    <div className="flex flex-row gap-3">
                        <Button
                            type="button"
                            variant={graphSettingsContext.settings.coloring === "normal" ? "default" : "secondary"}
                            className="w-1/5"
                            onClick={() => changeColoring("normal")}
                        >
                            Alle
                        </Button>
                        <Button
                            type="button"
                            variant={graphSettingsContext.settings.coloring === "outbreaks" ? "default" : "secondary"}
                            className="w-2/5"
                            onClick={() => changeColoring("outbreaks")}
                        >
                            Outbreaks
                        </Button>
                        <Button
                            type="button"
                            variant={graphSettingsContext.settings.coloring === "sampled_at" ? "default" : "secondary"}
                            className="w-2/5"
                            onClick={() => changeColoring("sampled_at")}
                        >
                            Sampling Time
                        </Button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
