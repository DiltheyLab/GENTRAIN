import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useDashboardGraphStore } from "@/stores/dashboardGraph";

export const DashboardGraphSettings = () => {
    const dashboardGraphStore = useDashboardGraphStore();

    const changeNodeSize = (value: number) => {
        dashboardGraphStore.updateGraphSettings({
            nodeSize: value,
        });
    };

    const changeLinkWidth = (value: number) => {
        dashboardGraphStore.updateGraphSettings({
            linkWidth: value,
        });
    };

    const changeCharge = (value: number) => {
        dashboardGraphStore.updateGraphSettings({ charge: value });
    };

    const changeLinkDistance = (value: number) => {
        dashboardGraphStore.updateGraphSettings({ linkDistance: value });
    };

    const changeZoomToFit = (checked: boolean) => {
        dashboardGraphStore.updateGraphSettings({ zoomToFit: checked });
    };

    const changeNodeStyle = (checked: boolean) => {
        dashboardGraphStore.updateGraphSettings({ showNodeLabel: checked });
    };

    return (
        <div className="relative flex-col items-center gap-8 flex min-h-[80vh]" x-chunk="dashboard-03-chunk-0">
            <form className="w-full items-start gap-3">
                <fieldset className="flex flex-col gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Einstellungen</legend>
                    <div className="flex flex-col gap-3">
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
                            defaultValue={[dashboardGraphStore.graphSettings.linkDistance]}
                            max={100}
                            min={10}
                            step={1}
                            onValueChange={(value) => changeLinkDistance(value[0])}
                        />
                        <Label htmlFor="forceCharge">Anziehungskraft</Label>
                        <Slider
                            id="forceCharge"
                            defaultValue={[dashboardGraphStore.graphSettings.charge ?? -50]}
                            max={0}
                            min={-100}
                            step={1}
                            onValueChange={(value) => changeCharge(value[0])}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="nodeDescription"
                            checked={!dashboardGraphStore.graphSettings.showNodeLabel}
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
                            checked={dashboardGraphStore.graphSettings.zoomToFit}
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
                {/*  <fieldset className="flex flex-col gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Filter</legend>
                    <div className="flex flex-row gap-3">
                        <Button
                            type="button"
                            variant={graphStore.graphSettings.filter === "all" ? "default" : "secondary"}
                            className="w-1/2"
                            onClick={() => changeFilter("all")}
                        >
                            Alle
                        </Button>
                        <Button
                            type="button"
                            variant={graphStore.graphSettings.filter === "outbreaks" ? "default" : "secondary"}
                            className="w-1/2"
                            onClick={() => changeFilter("outbreaks")}
                        >
                            Outbreaks
                        </Button>
                    </div>
                </fieldset>
                <fieldset className="flex flex-col gap-6 rounded-lg border p-4">
                    <legend className="-ml-1 px-1 text-sm font-medium">Einfärbung</legend>
                    <div className="flex gap-3 flex-wrap flex-col">
                        <Button
                            type="button"
                            variant={graphStore.graphSettings.coloring === "normal" ? "default" : "secondary"}
                            onClick={() => changeColoring("normal")}
                        >
                            Alle
                        </Button>
                        <Button
                            type="button"
                            variant={graphStore.graphSettings.coloring === "outbreaks" ? "default" : "secondary"}
                            onClick={() => changeColoring("outbreaks")}
                        >
                            Outbreaks
                        </Button>
                        <Button
                            type="button"
                            variant={graphStore.graphSettings.coloring === "registered_at" ? "default" : "secondary"}
                            onClick={() => changeColoring("registered_at")}
                        >
                            Sampling Time
                        </Button>
                    </div>
                </fieldset> */}
            </form>
        </div>
    );
};
