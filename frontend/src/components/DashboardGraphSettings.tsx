import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Box, Workflow } from "lucide-react";
import { useGraphSettings } from "@/providers/GraphSettingsProvider";
import { Slider } from "@/components/ui/slider";
import { Button } from "./ui/button";
import { importDataFromFile } from "@/database/db";

export const DashboardGraphSettings = () => {
    const graphSettingsContext = useGraphSettings();

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

    const getLegend = () => {
        const nodes = graphSettingsContext.settings.graphData.nodes;
        const uniqueGroups = nodes.filter((group, index, self) => {
            return index === self.findIndex((t) => t.group === group.group);
        });

        // ToDo: Add color picker for each group
        return uniqueGroups.map((node) => (
            <div className="flex items-center gap-2" key={node.group}>
                <span style={{ backgroundColor: `${node.color}` }} className={"rounded-full h-3 w-3"} />
                <p>{node.group}</p>
            </div>
        ));
    };
    return (
        <div className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0">
            <form className="grid w-full items-start gap-3">
                <fieldset className="grid gap-6 rounded-lg border p-4">
                    <div className="grid gap-3">
                        <Button
                            onClick={async (evt) => {
                                evt.preventDefault();
                                const blob = await fetch("/example_dataset.json").then((r) => r.blob());
                                importDataFromFile(blob);
                            }}
                        >
                            Import Test Data
                        </Button>
                    </div>
                </fieldset>
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
                    <legend className="-ml-1 px-1 text-sm font-medium">Legende</legend>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="role">Cluster</Label>
                        {getLegend()}
                    </div>
                </fieldset>
            </form>
        </div>
    );
};
